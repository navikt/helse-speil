import {
    SpesialistInfotrygdtypetekst,
    SpesialistInfotrygdutbetaling,
    SpesialistPerson,
    SpleisForlengelseFraInfotrygd,
} from 'external-types';

import { somDato } from './vedtaksperiode';

export const erInfotrygdforlengelse = (vedtaksperiode: Vedtaksperiode) =>
    vedtaksperiode.periodetype === 'infotrygdforlengelse';

export const tilTypetekst = (
    spesialistInfotrygdtypetekst: SpesialistInfotrygdtypetekst
): Infotrygdutbetaling['typetekst'] => {
    switch (spesialistInfotrygdtypetekst) {
        case SpesialistInfotrygdtypetekst.FERIE:
            return 'Ferie';
        case SpesialistInfotrygdtypetekst.UTBETALING:
            return 'Utbetaling';
        case SpesialistInfotrygdtypetekst.ARBEIDSGIVERREFUSJON:
            return 'ArbRef';
        case SpesialistInfotrygdtypetekst.UKJENT:
            return 'Ukjent';
        case SpesialistInfotrygdtypetekst.TILBAKEFØRT:
            return 'Tilbakeført';
        default:
            return spesialistInfotrygdtypetekst;
    }
};

export const mapInfotrygdutbetaling = (utbetaling: SpesialistInfotrygdutbetaling): Infotrygdutbetaling => ({
    fom: somDato(utbetaling.fom),
    tom: somDato(utbetaling.tom),
    grad: utbetaling.grad !== '' ? parseInt(utbetaling.grad) : undefined,
    dagsats: utbetaling.typetekst !== SpesialistInfotrygdtypetekst.FERIE ? utbetaling.dagsats : undefined,
    typetekst: tilTypetekst(utbetaling.typetekst),
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
