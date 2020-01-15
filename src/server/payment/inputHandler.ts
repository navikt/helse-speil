import { UnmappedUtbetalingsvedtak, Utbetalingslinje, Utbetalingsvedtak } from '../../types';

interface Utbetalingsbody extends Body {
    sak: UnmappedUtbetalingsvedtak;
    saksbehandlerIdent: string;
}

const map = (body: Utbetalingsbody) => {
    const { sak, saksbehandlerIdent } = body;
    return {
        sakskompleksId: sak.id,
        aktørId: sak.aktørId,
        organisasjonsnummer: sak.organisasjonsnummer,
        maksdato: sak.maksdato,
        saksbehandler: saksbehandlerIdent,
        utbetalingslinjer: sak.utbetalingslinjer?.map(linje => ({
            ...linje,
            grad: linje.grad ? linje.grad : 100
        })),
        utbetalingsreferanse: 'helse-simulering'
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
        fieldIsValid(sak.sakskompleksId, 'string') &&
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
