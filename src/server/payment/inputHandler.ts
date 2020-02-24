import { UnmappedUtbetalingsvedtak, Utbetalingslinje, Utbetalingsvedtak } from '../../types';

interface Utbetalingsbody extends Body {
    vedtaksperiode: UnmappedUtbetalingsvedtak;
    saksbehandlerIdent: string;
    aktørId: string;
    orgnr: string;
    fødselsnummer: string;
    erUtvidelse: boolean;
}

const map = (body: Utbetalingsbody): Utbetalingsvedtak => {
    const { vedtaksperiode, saksbehandlerIdent, fødselsnummer, aktørId, orgnr, erUtvidelse } = body;
    return {
        vedtaksperiodeId: vedtaksperiode.id,
        aktørId: aktørId,
        organisasjonsnummer: orgnr,
        maksdato: vedtaksperiode.maksdato,
        saksbehandler: saksbehandlerIdent,
        utbetalingslinjer: vedtaksperiode.utbetalingslinjer?.map(linje => ({
            ...linje,
            grad: 100 //TODO: Fiks dette når det ikke alltid er 100% sykmeldt lenger
        })),
        utbetalingsreferanse: vedtaksperiode.utbetalingsreferanse,
        fødselsnummer: fødselsnummer,
        erUtvidelse
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
        fieldIsValid(sak.utbetalingsreferanse, 'string') &&
        fieldIsValid(sak.erUtvidelse, 'boolean') &&
        utbetalingslinjerIsValid(sak.utbetalingslinjer)
    );
};

export default {
    isValid,
    map
};
