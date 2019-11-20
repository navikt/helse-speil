const personlookup = require('./personlookup');
const spleisClient = require('./spleisClient');

jest.mock('./spleisClient');
spleisClient.hentSak.mockResolvedValue({});
spleisClient.hentSakByUtbetalingsref.mockResolvedValue({});
afterEach(() => {
    jest.clearAllMocks();
});

const onBehalfOfStub = {
    hentFor: () => Promise.resolve()
};

beforeAll(() => {
    personlookup.setup({
        aktørIdLookup: {},
        spadeClient: {},
        config: { oidc: {} },
        onBehalfOf: onBehalfOfStub
    });
});

const mockResponse = (() => {
    const res = {};
    res.status = () => res;
    res.send = () => res;
    res.sendStatus = () => res;
    return res;
})();

describe('sakSøk', () => {
    const baseReq = {
        headers: { [personlookup.personIdHeaderName]: '123' },
        session: {}
    };

    test('sakSøk uten innsyn-header kaller spleisClient.hentSak', async () => {
        await personlookup.sakSøk(baseReq, mockResponse);

        expect(spleisClient.hentSak.mock.calls.length).toBe(1);
        expect(spleisClient.hentSakByUtbetalingsref.mock.calls.length).toBe(0);
    });

    test('sakSøk med innsyn-header kaller spleisClient.hentSakByUtbet...', async () => {
        const reqWithInnsynHeader = { ...baseReq, headers: { ...baseReq.headers, innsyn: 'true' } };
        await personlookup.sakSøk(reqWithInnsynHeader, mockResponse);

        expect(spleisClient.hentSak.mock.calls.length).toBe(0);
        expect(spleisClient.hentSakByUtbetalingsref.mock.calls.length).toBe(1);
    });
});
