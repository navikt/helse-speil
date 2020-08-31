import { SpesialistInfotrygdtypetekst, SpesialistPerson, SpleisForlengelseFraInfotrygd } from './types.external';
import { InfotrygdTypetekst, Infotrygdutbetaling } from '../types.internal';
import { somDato } from './vedtaksperiode';

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

export const mapInfotrygdutbetalinger = (person: SpesialistPerson): Infotrygdutbetaling[] =>
    person.infotrygdutbetalinger
        ?.filter((utbetaling) => utbetaling.typetekst !== SpesialistInfotrygdtypetekst.TILBAKEFØRT)
        .map((utbetaling) => ({
            fom: somDato(utbetaling.fom),
            tom: somDato(utbetaling.tom),
            grad: utbetaling.grad !== '' ? parseInt(utbetaling.grad) : undefined,
            dagsats: utbetaling.typetekst !== SpesialistInfotrygdtypetekst.FERIE ? utbetaling.dagsats : undefined,
            typetekst: tilTypetekst(utbetaling.typetekst) as InfotrygdTypetekst,
            organisasjonsnummer: utbetaling.organisasjonsnummer,
        })) ?? [];

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
