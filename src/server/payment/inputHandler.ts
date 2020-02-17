import { UnmappedUtbetalingsvedtak, Utbetalingslinje, Utbetalingsvedtak } from '../../types';

interface Utbetalingsbody extends Body {
    sak: UnmappedUtbetalingsvedtak;
    saksbehandlerIdent: string;
    aktorId: string;
    organisasjonsnummer: string;
    fødselsnummer: string;
}

const map = (body: Utbetalingsbody) => {
    const { sak, saksbehandlerIdent, fødselsnummer, aktorId, organisasjonsnummer } = body;
    return {
        vedtaksperiodeId: sak.id,
        aktørId: aktorId,
        organisasjonsnummer: organisasjonsnummer,
        maksdato: sak.maksdato,
        saksbehandler: saksbehandlerIdent,
        utbetalingslinjer: sak.utbetalingslinjer?.map(linje => ({
            ...linje,
            grad: 100 //TODO: Fiks dette når det ikke alltid er 100% sykmeldt lenger
        })),
        utbetalingsreferanse: 'helse-simulering',
        fødselsnummer: fødselsnummer
    };
};

const utbetalingslinjerIsValid = (linjer?: Utbetalingslinje[]) => {
    return (
        linjer === undefined ||
        (linjer.length > 0 &&
            linjer.find(
                linje =>
                    !fieldIsValid(linje.fom, 'string') ||
                    !fieldIsValid(linje.tom, 'string') ||
                    !fieldIsValid(linje.dagsats, 'number')
            ) === undefined)
    );
};

const fieldIsValid = (field: any, validType: string) =>
    field !== undefined && typeof field === validType;

const isValid = (sak: Utbetalingsvedtak): sak is Utbetalingsvedtak => {
    return (
        fieldIsValid(sak.vedtaksperiodeId, 'string') &&
        fieldIsValid(sak.organisasjonsnummer, 'string') &&
        fieldIsValid(sak.maksdato, 'string') &&
        fieldIsValid(sak.aktørId, 'string') &&
        utbetalingslinjerIsValid(sak.utbetalingslinjer)
    );
};

export default {
    isValid,
    map
};
