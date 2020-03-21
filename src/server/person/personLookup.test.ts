// @ts-nocheck
import personLookup from './personLookup';
afterEach(() => {
    jest.clearAllMocks();
});
const spleisClient = {
    hentPerson: () => Promise.resolve({ statusCode: 200, body: Promise.resolve('plain person') }),
    hentSakByUtbetalingsref: () => Promise.resolve({ statusCode: 200, body: Promise.resolve('utbetalt person') })
};

const onBehalfOfStub = {
    hentFor: () => Promise.resolve()
};

let hentAktørIdAnswer = Promise.resolve('123');

beforeAll(() => {
    personLookup.setup({
        aktørIdLookup: { hentAktørId: () => hentAktørIdAnswer },
        spleisClient,
        spadeClient: {},
        config: { oidc: {} },
        onBehalfOf: onBehalfOfStub
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
        session: {}
    };

    test('finnPerson uten innsyn-header kaller spleisClient.hentPerson', async () => {
        await personLookup.finnPerson(baseReq, mockResponse);

        const response = await mockResponse.send.mock.calls[0][0].person;
        expect(response).toBe('plain person');
    });

    test('finnPerson med innsyn-header kaller spleisClient.hentSakByUtbet...', async () => {
        const reqWithInnsynHeader = { ...baseReq, headers: { ...baseReq.headers, innsyn: 'true' } };
        await personLookup.finnPerson(reqWithInnsynHeader, mockResponse);

        const response = await mockResponse.send.mock.calls[0][0].person;
        expect(response).toBe('utbetalt person');
    });

    describe('oppslag på fødselsnummer', () => {
        const reqWithFnr = {
            ...baseReq,
            headers: { ...baseReq.headers, [personLookup.personIdHeaderName]: '11031888001' }
        };
        test('slår opp aktørId for fødselsnummer', async () => {
            await personLookup.finnPerson(reqWithFnr, mockResponse);

            assertResponseStatusCode(200);
        });

        test('returnerer 404 for ikke funnet fødselsnummer', async () => {
            hentAktørIdAnswer = Promise.reject();

            await personLookup.finnPerson(reqWithFnr, mockResponse);

            assertResponseStatusCode(404);
        });
    });
});

const assertResponseStatusCode = int => expect(mockResponse.status.mock.calls[0]?.[0]).toBe(int);

afterEach(() => {
    expect(mockResponse.status.mock.calls[0]?.[0]).not.toBeGreaterThanOrEqual(500);
});
