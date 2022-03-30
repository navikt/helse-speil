import { somDato } from '@utils/date';

export const erInfotrygdforlengelse = (vedtaksperiode: Vedtaksperiode) =>
    vedtaksperiode.periodetype === 'infotrygdforlengelse';

export const tilTypetekst = (
    spesialistInfotrygdtypetekst: ExternalInfotrygdutbetaling['typetekst'],
): Infotrygdutbetaling['typetekst'] => {
    switch (spesialistInfotrygdtypetekst) {
        case 'Ferie':
            return 'Ferie';
        case 'Utbetaling':
            return 'Utbetaling';
        case 'ArbRef':
            return 'ArbRef';
        case 'Ukjent..':
            return 'Ukjent';
        case 'Tilbakeført':
            return 'Tilbakeført';
        default:
            return spesialistInfotrygdtypetekst;
    }
};

export const mapInfotrygdutbetaling = (utbetaling: ExternalInfotrygdutbetaling): Infotrygdutbetaling => ({
    fom: somDato(utbetaling.fom),
    tom: somDato(utbetaling.tom),
    grad: utbetaling.grad !== '' ? parseInt(utbetaling.grad) : undefined,
    dagsats: utbetaling.typetekst !== 'Ferie' ? utbetaling.dagsats : undefined,
    typetekst: tilTypetekst(utbetaling.typetekst),
    organisasjonsnummer: utbetaling.organisasjonsnummer,
});

export const mapInfotrygdutbetalinger = (person: ExternalPerson): Infotrygdutbetaling[] =>
    person.infotrygdutbetalinger
        ?.filter((utbetaling) => utbetaling.typetekst !== 'Tilbakeført')
        .map(mapInfotrygdutbetaling) ?? [];

export const mapForlengelseFraInfotrygd = (
    value: ExternalVedtaksperiode['forlengelseFraInfotrygd'],
): boolean | undefined => {
    switch (value) {
        case 'JA':
            return true;
        case 'NEI':
            return false;
        case 'IKKE_ETTERSPURT':
            return undefined;
    }
};
