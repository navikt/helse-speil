const personlookupModule = require('./personlookup');
const spleisClient = require('./spleisClient');

jest.mock('./spleisClient');
spleisClient.hentSak.mockResolvedValue({ statusCode: 200 });
spleisClient.hentSakByUtbetalingsref.mockResolvedValue({ statusCode: 200 });
afterEach(() => {
    jest.clearAllMocks();
});

const onBehalfOfStub = {
    hentFor: () => Promise.resolve()
};

let hentAktørIdAnswer = Promise.resolve('123');
let personlookup;

beforeAll(() => {
    personlookup = personlookupModule.factory({
        aktørIdLookup: { hentAktørId: () => hentAktørIdAnswer },
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

describe('sakSøk', () => {
    const baseReq = {
        headers: { [personlookupModule.personIdHeaderName]: '123' },
        session: {}
    };

    test('sakSøk uten innsyn-header kaller spleisClient.hentSak', async () => {
        await personlookup.sakSøk(baseReq, mockResponse);

        expect(spleisClient.hentSak.mock.calls.length).toBe(1);
        expect(spleisClient.hentSakByUtbetalingsref.mock.calls.length).toBe(0);
        assertResponseStatusCode(200);
    });

    test('sakSøk med innsyn-header kaller spleisClient.hentSakByUtbet...', async () => {
        const reqWithInnsynHeader = { ...baseReq, headers: { ...baseReq.headers, innsyn: 'true' } };
        await personlookup.sakSøk(reqWithInnsynHeader, mockResponse);

        expect(spleisClient.hentSak.mock.calls.length).toBe(0);
        expect(spleisClient.hentSakByUtbetalingsref.mock.calls.length).toBe(1);
        assertResponseStatusCode(200);
    });

    describe('oppslag på fødselsnummer', () => {
        const reqWithFnr = {
            ...baseReq,
            headers: { ...baseReq.headers, [personlookupModule.personIdHeaderName]: '11031888001' }
        };
        test('slår opp aktørId for fødselsnummer', async () => {
            await personlookup.sakSøk(reqWithFnr, mockResponse);

            assertResponseStatusCode(200);
        });

        test('returnerer 404 for ikke funnet fødselsnummer', async () => {
            hentAktørIdAnswer = Promise.reject();

            await personlookup.sakSøk(reqWithFnr, mockResponse);

            assertResponseStatusCode(404);
        });
    });
});

const assertResponseStatusCode = int => expect(mockResponse.status.mock.calls[0]?.[0]).toBe(int);

afterEach(() => {
    expect(mockResponse.status.mock.calls[0]?.[0]).not.toBeGreaterThanOrEqual(500);
});
