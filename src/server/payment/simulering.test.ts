import { cleanup } from '@testing-library/react';

import simuleringInit from './simulering';

const simulering = simuleringInit.setup({
    aktoerregisterUrl: '',
    serviceUserName: '',
    serviceUserPassword: '',
    stsUrl: '',
    spennUrl: 'http://spenn'
});

afterEach(cleanup);

test('simulation with valid input runs ok', async () => {
    await expect(
        simulering.simuler(validVedtak, createToken({ name: 'Navn Navnesen' }))
    ).resolves.toMatch('Navn Navnesen');
});

const createToken = (claims: { name: string }) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(claims))}.bogussignature`;
};

const validVedtak = {
    sakskompleksId: '1234-1234-1234-1234',
    aktørId: '123456',
    organisasjonsnummer: '987654321',
    utbetalingslinjer: [
        {
            fom: '2019-09-27',
            tom: '2019-09-28',
            dagsats: 12345
        }
    ],
    maksdato: '2019-10-27'
};
