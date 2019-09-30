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
    expect(simulation.isValid(vedtakWithToManyKeys)).toEqual(false);
});

test('run simulation', () => {
    expect(
        simulation.simulate(validVedtak, createToken({ name: 'Navn Navnesen' }))
    ).resolves.not.toBeNull();
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

const vedtakWithToManyKeys = {
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
    maksDato: '2019-10-27',
    something: 'whatever'
};
