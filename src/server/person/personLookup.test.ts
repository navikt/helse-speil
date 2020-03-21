// @ts-nocheck
import personLookup from './personLookup';
import spleisClient from './spleisClient';

jest.mock('./spleisClient');
spleisClient.hentPerson.mockResolvedValue({ statusCode: 200 });
spleisClient.hentSakByUtbetalingsref.mockResolvedValue({ statusCode: 200 });
afterEach(() => {
    jest.clearAllMocks();
});

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

    test('finnPerson uten innsyn-header kaller spleisClient.hentSak', async () => {
        await personLookup.finnPerson(baseReq, mockResponse);

        expect(spleisClient.hentPerson.mock.calls.length).toBe(1);
        expect(spleisClient.hentSakByUtbetalingsref.mock.calls.length).toBe(0);
        assertResponseStatusCode(200);
    });

    test('finnPerson med innsyn-header kaller spleisClient.hentSakByUtbet...', async () => {
        const reqWithInnsynHeader = { ...baseReq, headers: { ...baseReq.headers, innsyn: 'true' } };
        await personLookup.finnPerson(reqWithInnsynHeader, mockResponse);

        expect(spleisClient.hentPerson.mock.calls.length).toBe(0);
        expect(spleisClient.hentSakByUtbetalingsref.mock.calls.length).toBe(1);
        assertResponseStatusCode(200);
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
