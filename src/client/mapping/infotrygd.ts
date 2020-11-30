import {
    SpesialistInfotrygdtypetekst,
    SpesialistInfotrygdutbetaling,
    SpesialistPerson,
    SpleisForlengelseFraInfotrygd,
} from 'external-types';
import { InfotrygdTypetekst, Infotrygdutbetaling, Periodetype, Vedtaksperiode } from 'internal-types';
import { somDato } from './vedtaksperiode';

export const erInfotrygdforlengelse = (vedtaksperiode: Vedtaksperiode) =>
    vedtaksperiode.periodetype === Periodetype.Infotrygdforlengelse;

export const tilTypetekst = (
    spesialistInfotrygdtypetekst: SpesialistInfotrygdtypetekst
): InfotrygdTypetekst | string => {
    switch (spesialistInfotrygdtypetekst) {
        case SpesialistInfotrygdtypetekst.FERIE:
            return InfotrygdTypetekst.FERIE;
        case SpesialistInfotrygdtypetekst.UTBETALING:
            return InfotrygdTypetekst.UTBETALING;
        case SpesialistInfotrygdtypetekst.ARBEIDSGIVERREFUSJON:
            return InfotrygdTypetekst.ARBEIDSGIVERREFUSJON;
        case SpesialistInfotrygdtypetekst.UKJENT:
            return InfotrygdTypetekst.UKJENT;
        case SpesialistInfotrygdtypetekst.TILBAKEFØRT:
            return InfotrygdTypetekst.TILBAKEFØRT;
        default:
            return spesialistInfotrygdtypetekst;
    }
};

export const mapInfotrygdutbetaling = (utbetaling: SpesialistInfotrygdutbetaling): Infotrygdutbetaling => ({
    fom: somDato(utbetaling.fom),
    tom: somDato(utbetaling.tom),
    grad: utbetaling.grad !== '' ? parseInt(utbetaling.grad) : undefined,
    dagsats: utbetaling.typetekst !== SpesialistInfotrygdtypetekst.FERIE ? utbetaling.dagsats : undefined,
    typetekst: tilTypetekst(utbetaling.typetekst) as InfotrygdTypetekst,
    organisasjonsnummer: utbetaling.organisasjonsnummer,
});

export const mapInfotrygdutbetalinger = (person: SpesialistPerson): Infotrygdutbetaling[] =>
    person.infotrygdutbetalinger
        ?.filter((utbetaling) => utbetaling.typetekst !== SpesialistInfotrygdtypetekst.TILBAKEFØRT)
        .map(mapInfotrygdutbetaling) ?? [];

export const mapForlengelseFraInfotrygd = (value: SpleisForlengelseFraInfotrygd): boolean | undefined => {
    switch (value) {
        case SpleisForlengelseFraInfotrygd.JA:
            return true;
        case SpleisForlengelseFraInfotrygd.NEI:
            return false;
        case SpleisForlengelseFraInfotrygd.IKKE_ETTERSPURT:
            return undefined;
    }
};
