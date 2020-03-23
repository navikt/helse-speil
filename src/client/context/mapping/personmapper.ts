import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Hendelse, Hendelsestype, Inntektsmelding, Kjønn, Person, Personinfo, Vedtaksperiode } from '../types';
import { Personinfo as SpleisPersoninfo, SpleisVedtaksperiodetilstand } from '../../../types';
import {
    mapUferdigVedtaksperiode,
    mapVedtaksperiode,
    somDato,
    somKanskjeDato,
    somTidspunkt
} from './vedtaksperiodemapper';
import {
    SpleisHendelse,
    SpleisHendelsetype,
    SpleisInntektsmelding,
    SpleisPerson,
    SpleisSendtSøknad,
    SpleisVedtaksperiode
} from './external.types';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const mapHendelser = (hendelser: SpleisHendelse[]): Hendelse[] =>
    hendelser
        .map(hendelse => {
            switch (hendelse.type) {
                case SpleisHendelsetype.INNTEKTSMELDING:
                    return {
                        id: hendelse.hendelseId,
                        type: Hendelsestype.Inntektsmelding,
                        beregnetInntekt: (hendelse as SpleisInntektsmelding).beregnetInntekt,
                        førsteFraværsdag: somDato((hendelse as SpleisInntektsmelding).førsteFraværsdag),
                        mottattTidspunkt: somTidspunkt((hendelse as SpleisInntektsmelding).mottattDato)
                    };
                case SpleisHendelsetype.SØKNAD:
                    return {
                        id: hendelse.hendelseId,
                        type: Hendelsestype.Søknad,
                        fom: somDato(hendelse.fom),
                        tom: somDato(hendelse.tom),
                        sendtNav: somDato((hendelse as SpleisSendtSøknad).sendtNav),
                        rapportertDato: somKanskjeDato(hendelse.rapportertdato)
                    };
                case SpleisHendelsetype.SYKMELDING:
                    return {
                        id: hendelse.hendelseId,
                        type: Hendelsestype.Sykmelding,
                        fom: somDato(hendelse.fom),
                        tom: somDato(hendelse.tom),
                        rapportertDato: somKanskjeDato(hendelse.rapportertdato)
                    };
            }
        })
        .filter(hendelse => hendelse) as Hendelse[];

const finnGjeldendeInntektsmelding = (gjeldendeUtbetalingsreferanse: string, person: SpleisPerson): Inntektsmelding => {
    const hendelserForUtbetalingsreferanser = person.arbeidsgivere
        .flatMap(arbeidsgiver => arbeidsgiver.vedtaksperioder)
        .filter(periode => periode.utbetalingsreferanse === gjeldendeUtbetalingsreferanse)
        .flatMap(periode => periode.hendelser);
    return mapHendelser(
        person.hendelser
            .filter(hendelse => hendelserForUtbetalingsreferanser.includes(hendelse.hendelseId))
            .filter(hendelse => hendelse.type == SpleisHendelsetype.INNTEKTSMELDING)
    )[0] as Inntektsmelding;
};

const kanVises = (vedtaksperiodeType: SpleisVedtaksperiodetilstand) =>
    [
        SpleisVedtaksperiodetilstand.AVSLUTTET,
        SpleisVedtaksperiodetilstand.UTBETALING_FEILET,
        SpleisVedtaksperiodetilstand.ANNULLERT,
        SpleisVedtaksperiodetilstand.AVVENTER_GODKJENNING
    ].includes(vedtaksperiodeType);

const tilArbeidsgivere = (person: SpleisPerson, personinfo: Personinfo, hendelser: Hendelse[]) =>
    person.arbeidsgivere.map(arbeidsgiver => {
        const tilVedtaksperiode = (periode: SpleisVedtaksperiode) => {
            const gjeldendeInntektsmelding = finnGjeldendeInntektsmelding(periode.utbetalingsreferanse, person);

            if (kanVises(periode.tilstand as SpleisVedtaksperiodetilstand)) {
                return mapVedtaksperiode(
                    periode,
                    personinfo,
                    hendelser.filter(hendelse => periode.hendelser.includes(hendelse.id)),
                    gjeldendeInntektsmelding,
                    arbeidsgiver.organisasjonsnummer
                );
            } else {
                return mapUferdigVedtaksperiode(periode);
            }
        };

        return {
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode).sort(reversert)
        };
    });

export const mapPersoninfo = (spleisPersoninfo: SpleisPersoninfo): Personinfo => ({
    fnr: spleisPersoninfo.fnr,
    navn: spleisPersoninfo.navn,
    kjønn: spleisPersoninfo.kjønn as Kjønn,
    fødselsdato: somDato(spleisPersoninfo.fødselsdato)
});

export const tilPerson = (spleisPerson: SpleisPerson, spleisPersoninfo: SpleisPersoninfo): Person =>
    tilPersonMedInfo(spleisPerson, mapPersoninfo(spleisPersoninfo));

export const tilPersonMedInfo = (spleisPerson: SpleisPerson, personinfo: Personinfo) => {
    const hendelser = mapHendelser(spleisPerson.hendelser);
    return {
        aktørId: spleisPerson.aktørId,
        personinfo: personinfo,
        arbeidsgivere: tilArbeidsgivere(spleisPerson, personinfo, hendelser),
        fødselsnummer: spleisPerson.fødselsnummer,
        hendelser: hendelser
    };
};
