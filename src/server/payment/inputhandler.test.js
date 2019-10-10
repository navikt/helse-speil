import { cleanup } from '@testing-library/react';

const inputHandler = require('./inputhandler');

afterEach(cleanup);

test('behandling is valid if all required fields are present and correctly typed', () => {
    expect(inputHandler.isValid(validBehandling)).toBeTruthy();
});

test('behandling with extra field is ok', () => {
    const behandling = { a: 2, ...validBehandling };
    expect(inputHandler.isValid(behandling)).toBeTruthy();
});

test('behandling with wrongly typed field in root level is not ok', () => {
    const behandling = { ...validBehandling };
    behandling.vedtak = 'should not be a string';
    expect(inputHandler.isValid(behandling)).toBeFalsy();
});

test('behandling with wrongly typed field in sub-level is not ok', () => {
    const behandling = { ...validBehandling };
    behandling.vedtak.perioder[0].fom = 123;
    expect(inputHandler.isValid(behandling)).toBeFalsy();
});

test('behandling with missing required field in sub-leve is not ok', () => {
    const behandling = { ...validBehandling };
    delete behandling.vedtak.perioder[0].dagsats;
    expect(inputHandler.isValid(behandling)).toBeFalsy();
});

const validBehandling = {
    originalSøknad: {
        id: 123,
        aktorId: '11111'
    },
    vedtak: {
        perioder: [
            {
                fom: '2019-05-09',
                tom: '2019-05-24',
                dagsats: 1603,
                grad: 100,
                fordeling: [
                    {
                        mottager: '999999999',
                        andel: 100
                    }
                ]
            }
        ]
    },
    avklarteVerdier: {
        maksdato: {
            fastsattVerdi: '2019-05-24'
        }
    }
};
