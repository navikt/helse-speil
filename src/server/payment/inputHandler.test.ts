// @ts-nocheck
import { cleanup } from '@testing-library/react';
import inputHandler from './inputHandler';
import { Utbetalingsvedtak } from '../../types';

afterEach(cleanup);

test('input is valid if all required fields are present and correctly typed', () => {
    expect(inputHandler.validate(validUtbetalingsvedtak).result).toBe(true);
});

test('input with extra field is ok', () => {
    const vedtak = { a: 2, ...validUtbetalingsvedtak };
    expect(inputHandler.validate(vedtak).result).toBe(true);
});

test('input with wrongly typed field in root level is not ok', () => {
    const vedtak = { ...validUtbetalingsvedtak };
    vedtak.maksdato = 123;
    expect(inputHandler.validate(vedtak).result).toBe(false);
});

test('returns relevant error message', () => {
    const vedtak = { ...validUtbetalingsvedtak };
    delete vedtak.erUtvidelse;
    expect(inputHandler.validate(vedtak).errors).toContain(
        "Forventet å motta feltet 'erUtvidelse' av type boolean."
    );
});

describe('utbetalingslinjer', () => {
    const errorMessageForUtbetalingslinjer = `Forventet å motta utbetalingslinjer med 'fom', 'tom' og 'dagsats'.`;

    test('vedtak with wrongly typed field in sub-level is not ok', () => {
        const vedtak = { ...validUtbetalingsvedtak };
        vedtak.utbetalingslinjer[0].fom = 123;
        expect(inputHandler.validate(vedtak).result).toBe(false);
        expect(inputHandler.validate(vedtak).errors).toContain(errorMessageForUtbetalingslinjer);
    });

    test('vedtak with missing required field in sub-level is not ok', () => {
        const vedtak = { ...validUtbetalingsvedtak };
        delete vedtak.utbetalingslinjer[0].dagsats;
        expect(inputHandler.validate(vedtak).result).toBe(false);
        expect(inputHandler.validate(vedtak).errors).toContain(errorMessageForUtbetalingslinjer);
    });

    test('vedtak without utbetalingslinjer', () => {
        // Jeg er usikker på om det er riktig at vi skal kunne sende vedtak uten utbetalingslinjer
        // til Spenn, men koden tillater det per i dag.
        const vedtak = { ...validUtbetalingsvedtak };
        delete vedtak.utbetalingslinjer;
        expect(inputHandler.validate(vedtak).result).toBe(true);
    });
});

const validUtbetalingsvedtak: Utbetalingsvedtak = {
    vedtaksperiodeId: '9485bde4-6541-4dcf-aa53-8b466fc4ac87',
    aktørId: '0123456789012',
    organisasjonsnummer: '123456789',
    utbetalingsreferanse: 'banan',
    utbetalingslinjer: [
        {
            fom: '2019-05-09',
            tom: '2019-05-24',
            dagsats: 1603
        }
    ],
    maksdato: '2019-05-27',
    erUtvidelse: false
};
