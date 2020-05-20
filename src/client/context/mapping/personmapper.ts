import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Infotrygdtypetekst, Infotrygdutbetaling, Kjønn, Person, Personinfo, Vedtaksperiode } from '../types.internal';
import { Personinfo as SpleisPersoninfo } from '../../../types';
import { mapUferdigVedtaksperiode, mapVedtaksperiode, somDato } from './vedtaksperiodemapper';
import { SpesialistInfotrygdtypetekst, SpesialistPerson, SpesialistVedtaksperiode } from './types.external';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const tilArbeidsgivere = (person: SpesialistPerson, personinfo: Personinfo) =>
    person.arbeidsgivere.map(arbeidsgiver => {
        const tilVedtaksperiode = (periode: SpesialistVedtaksperiode) => {
            if (periode.fullstendig) {
                return mapVedtaksperiode(periode, personinfo, arbeidsgiver.organisasjonsnummer);
            } else {
                return mapUferdigVedtaksperiode(periode);
            }
        };

        return {
            navn: arbeidsgiver.navn,
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode).sort(reversert)
        };
    });

const tilInfotrygdutbetalinger = (spesialistPerson: SpesialistPerson): Infotrygdutbetaling[] => {
    const toTypetekst = (
        spesialistInfotrygdtypetekst: SpesialistInfotrygdtypetekst | string
    ): Infotrygdtypetekst | string => {
        switch (spesialistInfotrygdtypetekst) {
            case SpesialistInfotrygdtypetekst.FERIE:
                return Infotrygdtypetekst.FERIE;
            case SpesialistInfotrygdtypetekst.UTBETALING:
                return Infotrygdtypetekst.UTBETALING;
            case SpesialistInfotrygdtypetekst.ARBEIDSGIVERREFUSJON:
                return Infotrygdtypetekst.ARBEIDSGIVERREFUSJON;
            case SpesialistInfotrygdtypetekst.UKJENT:
                return Infotrygdtypetekst.UKJENT;
            case SpesialistInfotrygdtypetekst.TILBAKEFØRT:
                return Infotrygdtypetekst.TILBAKEFØRT;
            default:
                return spesialistInfotrygdtypetekst;
        }
    };

    return (
        spesialistPerson.infotrygdutbetalinger
            ?.filter(utbetaling => utbetaling.typetekst !== SpesialistInfotrygdtypetekst.TILBAKEFØRT)
            .map(utbetaling => ({
                fom: somDato(utbetaling.fom),
                tom: somDato(utbetaling.tom),
                grad: utbetaling.grad !== '' ? parseInt(utbetaling.grad) : undefined,
                dagsats: utbetaling.typetekst !== SpesialistInfotrygdtypetekst.FERIE ? utbetaling.dagsats : undefined,
                typetekst: toTypetekst(utbetaling.typetekst) as Infotrygdtypetekst,
                organisasjonsnummer: utbetaling.organisasjonsnummer
            })) ?? []
    );
};

export const tilPersonMedInfo = (spesialistPerson: SpesialistPerson, personinfo: Personinfo) => ({
    aktørId: spesialistPerson.aktørId,
    fødselsnummer: spesialistPerson.fødselsnummer,
    navn: spesialistPerson.navn,
    arbeidsgivere: tilArbeidsgivere(spesialistPerson, personinfo),
    personinfo: personinfo,
    infotrygdutbetalinger: tilInfotrygdutbetalinger(spesialistPerson)
});

export const mapPersoninfo = (spleisPersoninfo: SpleisPersoninfo): Personinfo => ({
    fnr: spleisPersoninfo.fnr,
    kjønn: spleisPersoninfo.kjønn as Kjønn,
    fødselsdato: somDato(spleisPersoninfo.fødselsdato)
});

export const tilPerson = (spesialistPerson: SpesialistPerson, spleisPersoninfo: SpleisPersoninfo): Person =>
    tilPersonMedInfo(spesialistPerson, mapPersoninfo(spleisPersoninfo));
