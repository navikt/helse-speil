import { cleanup } from '@testing-library/react';

const simulation = require('./simulation').setup({ spennUrl: 'http://spenn' });

afterEach(cleanup);

test('valid vedtak is valid', () => {
    expect(simulation.isValid(validVedtak)).toEqual(true);
});

test('vedtak with missing keys is invalid', () => {
    expect(simulation.isValid(vedtakWithMissingKeys)).toEqual(false);
});

test('vedtak with to many keys is invalid', () => {
    expect(simulation.isValid(vedtakWithTooManyKeysInRootLevel)).toEqual(false);
});

test('vedtak with to many keys is invalid', () => {
    expect(simulation.isValid(vedtakWithTooManyKeysInSublevel)).toEqual(false);
});

test('vedtak with wrong key types is invalid', () => {
    expect(simulation.isValid(vedtakWithWrongKeyTypeInRootLevel)).toEqual(false);
});

test('vedtak with wrong key types is invalid', () => {
    expect(simulation.isValid(vedtakWithWrongKeyTypeInSublevel)).toEqual(false);
});

test('simulation with valid input runs ok', () => {
    expect(
        simulation.simulate(validVedtak, createToken({ name: 'Navn Navnesen' }))
    ).resolves.not.toBeNull();
});

test('simulation with invalid input is rejected', () => {
    expect(
        simulation.simulate(vedtakWithMissingKeys, createToken({ name: 'Navn Navnesen' }))
    ).rejects.toMatch('Invalid vedtak supplied');
});

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(claims))}.bogussignature`;
};

const validVedtak = {
    soknadId: 'abcd123',
    aktorId: '123456',
    vedtaksperioder: [
        {
            fom: '2019-09-27',
            tom: '2019-09-28',
            grad: 100,
            dagsats: 12345,
            fordeling: [{ mottager: 'orgnr', andel: 100 }]
        }
    ],
    maksDato: '2019-10-27'
};

const vedtakWithMissingKeys = {
    soknadId: 'abcd123',
    vedtaksperioder: [],
    maksDato: '2019-10-27'
};

const vedtakWithTooManyKeysInRootLevel = {
    soknadId: 'abcd123',
    aktorId: '123456',
    vedtaksperioder: [],
    maksDato: '2019-10-27',
    something: 'whatever'
};

const vedtakWithTooManyKeysInSublevel = {
    soknadId: 'abcd123',
    aktorId: '123456',
    vedtaksperioder: [
        {
            fom: '2019-09-27',
            tom: '2019-09-28',
            grad: 100,
            dagsats: 12345,
            fordeling: [{ mottager: 'orgnr', andel: 100, whatever: 'blabla' }]
        }
    ],
    maksDato: '2019-10-27'
};

const vedtakWithWrongKeyTypeInRootLevel = {
    soknadId: 'abcd123',
    aktorId: 123456,
    vedtaksperioder: [],
    maksDato: '2019-10-27'
};

const vedtakWithWrongKeyTypeInSublevel = {
    soknadId: 'abcd123',
    aktorId: '123456',
    vedtaksperioder: [
        {
            fom: '2019-09-27',
            tom: '2019-09-28',
            grad: 100,
            dagsats: '12345',
            fordeling: [{ mottager: 'orgnr', andel: 100 }]
        }
    ],
    maksDato: '2019-10-27'
};
