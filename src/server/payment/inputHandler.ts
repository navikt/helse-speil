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
            ...linje
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

const fieldIsValid = (field: any, validType: string) => field !== undefined && typeof field === validType;

const validate = (sak: Utbetalingsvedtak): SimulationValidationResult => {
    const validations = {
        vedtaksperiodeId: 'string',
        organisasjonsnummer: 'string',
        aktørId: 'string',
        utbetalingsreferanse: 'string',
        erUtvidelse: 'boolean'
    };

    const errors = Object.entries(validations).map(([key, value]) => {
        return !fieldIsValid(sak[key], value) ? `Forventet å motta feltet '${key}' av type ${value}.` : '';
    });

    if (!utbetalingslinjerIsValid(sak.utbetalingslinjer)) {
        errors.push(`Forventet å motta utbetalingslinjer med 'fom', 'tom' og 'dagsats'.`);
    }

    const onlyActualErrors = errors.filter(errorMessage => errorMessage.trim().length > 0);
    return {
        result: onlyActualErrors.length === 0,
        errors: onlyActualErrors
    };
};

interface SimulationValidationResult {
    result: boolean;
    errors: string[];
}

export default {
    validate,
    map
};
