// @ts-nocheck
import personLookup from './personLookup';

afterEach(() => {
    jest.clearAllMocks();
});

const spesialistClient = {
    hentPersonByAktørId: () => Promise.resolve({ statusCode: 200, body: Promise.resolve('plain person aktørId') }),
    hentPersonByFødselsnummer: () =>
        Promise.resolve({ statusCode: 200, body: Promise.resolve('plain person fødselsnummer') }),
    hentSakByUtbetalingsref: () => Promise.resolve({ statusCode: 200, body: Promise.resolve('utbetalt person') }),
};

const onBehalfOfStub = {
    hentFor: () => Promise.resolve(),
};

let hentAktørIdAnswer = Promise.resolve('123');

beforeAll(() => {
    personLookup.setup({
        aktørIdLookup: { hentAktørId: () => hentAktørIdAnswer },
        spesialistClient,
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
        expect(response).toBe('plain person aktørId');
    });

    test('finnPerson med innsyn-header kaller spesialistClient.hentSakByUtbetalingsref...', async () => {
        const reqWithInnsynHeader = { ...baseReq, headers: { ...baseReq.headers, innsyn: 'true' } };
        await personLookup.finnPerson(reqWithInnsynHeader, mockResponse);

        const response = await mockResponse.send.mock.calls[0][0].person;
        expect(response).toBe('utbetalt person');
    });

    describe('oppslag på fødselsnummer', () => {
        const reqWithFnr = {
            ...baseReq,
            headers: { ...baseReq.headers, [personLookup.personIdHeaderName]: '11031888001' },
        };
        test('finnPerson med fødselsnummer kaller spesialistClient.hentPersonByFødselsnummer', async () => {
            await personLookup.finnPerson(reqWithFnr, mockResponse);

            const response = await mockResponse.send.mock.calls[0][0].person;
            expect(response).toBe('plain person fødselsnummer');
        });
    });
});

const assertResponseStatusCode = (int) => expect(mockResponse.status.mock.calls[0]?.[0]).toBe(int);

afterEach(() => {
    expect(mockResponse.status.mock.calls[0]?.[0]).not.toBeGreaterThanOrEqual(500);
});
