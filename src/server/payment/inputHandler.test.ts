// @ts-nocheck
import { cleanup } from '@testing-library/react';
import inputHandler from './inputHandler';
import { Utbetalingsvedtak } from '../../types';

afterEach(cleanup);

test('sak is valid if all required fields are present and correctly typed', () => {
    expect(inputHandler.isValid(validSak)).toBeTruthy();
});

test('sak with extra field is ok', () => {
    const sak = { a: 2, ...validSak };
    expect(inputHandler.isValid(sak)).toBeTruthy();
});

test('sak with wrongly typed field in root level is not ok', () => {
    const sak = { ...validSak };
    sak.maksdato = 123;
    expect(inputHandler.isValid(sak)).toBeFalsy();
});

test('sak with wrongly typed field in sub-level is not ok', () => {
    const sak = { ...validSak };
    sak.utbetalingslinjer[0].fom = 123;
    expect(inputHandler.isValid(sak)).toBeFalsy();
});

test('sak with missing required field in sub-level is not ok', () => {
    const sak = { ...validSak };
    delete sak.utbetalingslinjer[0].dagsats;
    expect(inputHandler.isValid(sak)).toBeFalsy();
});

const validSak: Utbetalingsvedtak = {
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
    maksdato: '2019-05-27'
};
