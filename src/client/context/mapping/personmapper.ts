import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Hendelse, Hendelsestype, Kjønn, Person, Personinfo, Vedtaksperiode } from '../types';
import { Personinfo as SpleisPersoninfo } from '../../../types';
import { mapVedtaksperiode, somDato, somKanskjeDato, somTidspunkt } from './vedtaksperiodemapper';
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
    hendelser.map(hendelse => {
        switch (hendelse.type) {
            case SpleisHendelsetype.INNTEKTSMELDING:
                return {
                    hendelseId: hendelse.hendelseId,
                    type: Hendelsestype.Inntektsmelding,
                    beregnetInntekt: (hendelse as SpleisInntektsmelding).beregnetInntekt,
                    førsteFraværsdag: somDato((hendelse as SpleisInntektsmelding).førsteFraværsdag),
                    mottattTidspunkt: somTidspunkt((hendelse as SpleisInntektsmelding).mottattDato)
                };
            case SpleisHendelsetype.SØKNAD:
                return {
                    hendelseId: hendelse.hendelseId,
                    type: Hendelsestype.Søknad,
                    fom: somDato(hendelse.fom),
                    tom: somDato(hendelse.tom),
                    sendtNav: somDato((hendelse as SpleisSendtSøknad).sendtNav),
                    rapportertDato: somKanskjeDato(hendelse.rapportertdato)
                };
            case SpleisHendelsetype.SYKMELDING:
                return {
                    hendelseId: hendelse.hendelseId,
                    type: Hendelsestype.Sykmelding,
                    fom: somDato(hendelse.fom),
                    tom: somDato(hendelse.tom),
                    rapportertDato: somKanskjeDato(hendelse.rapportertdato)
                };
        }
    });

const tilArbeidsgivere = (person: SpleisPerson, personinfo: Personinfo, hendelser: Hendelse[]) =>
    person.arbeidsgivere.map(arbeidsgiver => {
        const dataForVilkårsvurdering = arbeidsgiver.vedtaksperioder
            .map(periode => periode.dataForVilkårsvurdering)
            .find(data => data !== undefined && data !== null);

        const tilVedtaksperiode = (periode: SpleisVedtaksperiode) =>
            mapVedtaksperiode(
                periode,
                personinfo,
                hendelser.filter(hendelse => periode.hendelser.includes(hendelse.hendelseId)),
                dataForVilkårsvurdering,
                arbeidsgiver.organisasjonsnummer
            );

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
