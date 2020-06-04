// @ts-nocheck
import personLookup from './personLookup';

afterEach(() => {
    jest.clearAllMocks();
});

const plainPerson = {
    arbeidsgivere: [
        {
            vedtaksperioder: [
                {
                    oppgavereferanse: '123',
                },
            ],
        },
    ],
};

const utbetaltPerson = {
    arbeidsgivere: [
        {
            vedtaksperioder: [
                {
                    tilstand: 'Avsluttet',
                },
            ],
        },
    ],
};

const spesialistClient = {
    hentPersonByAktørId: () => Promise.resolve({ statusCode: 200, body: plainPerson }),
    hentPersonByFødselsnummer: () => Promise.resolve({ statusCode: 200, body: plainPerson }),
    hentSakByUtbetalingsref: () => Promise.resolve({ statusCode: 200, body: utbetaltPerson }),
};

const storage = {
    get: () => Promise.resolve(null),
};
const onBehalfOfStub = {
    hentFor: () => Promise.resolve(),
};

let hentAktørIdAnswer = Promise.resolve('123');

beforeAll(() => {
    personLookup.setup({
        aktørIdLookup: { hentAktørId: () => hentAktørIdAnswer },
        spesialistClient,
        storage,
        config: { oidc: {} },
        onBehalfOf: onBehalfOfStub,
    });
});

const mockResponse = (() => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.sendStatus = res.status;
    res.send = jest.fn().mockReturnValue(res);
    return res;
})();

describe('finnPerson', () => {
    const baseReq = {
        headers: { [personLookup.personIdHeaderName]: '123' },
        session: {},
    };

    test('finnPerson uten innsyn-header kaller spesialistClient.hentPersonByAktørId', async () => {
        await personLookup.finnPerson(baseReq, mockResponse);

        const response = await mockResponse.send.mock.calls[0][0].person;
        expect(response).toStrictEqual({ ...plainPerson, tildeltTil: null });
    });

    test('finnPerson med innsyn-header kaller spesialistClient.hentSakByUtbetalingsref...', async () => {
        const reqWithInnsynHeader = { ...baseReq, headers: { ...baseReq.headers, innsyn: 'true' } };
        await personLookup.finnPerson(reqWithInnsynHeader, mockResponse);

        const response = await mockResponse.send.mock.calls[0][0].person;
        expect(response).toStrictEqual({ ...utbetaltPerson, tildeltTil: null });
    });

    describe('oppslag på fødselsnummer', () => {
        const reqWithFnr = {
            ...baseReq,
            headers: { ...baseReq.headers, [personLookup.personIdHeaderName]: '11031888001' },
        };
        test('finnPerson med fødselsnummer kaller spesialistClient.hentPersonByFødselsnummer', async () => {
            await personLookup.finnPerson(reqWithFnr, mockResponse);

            const response = await mockResponse.send.mock.calls[0][0].person;
            expect(response).toStrictEqual({ ...plainPerson, tildeltTil: null });
        });
    });
});

const assertResponseStatusCode = (int) => expect(mockResponse.status.mock.calls[0]?.[0]).toBe(int);

afterEach(() => {
    expect(mockResponse.status.mock.calls[0]?.[0]).not.toBeGreaterThanOrEqual(500);
});
