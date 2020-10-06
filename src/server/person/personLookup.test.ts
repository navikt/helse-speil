// @ts-nocheck
import personLookup from './personLookup';

afterEach(() => {
    jest.clearAllMocks();
});

const personByAktørId = {
    arbeidsgivere: [
        {
            vedtaksperioder: [
                {
                    oppgavereferanse: '9977',
                },
            ],
        },
    ],
};

const personByFnr = {
    arbeidsgivere: [
        {
            vedtaksperioder: [
                {
                    oppgavereferanse: '5511',
                },
            ],
        },
    ],
};

const spesialistClient = {
    hentPersonByAktørId: () => Promise.resolve({ status: 200, body: personByAktørId }),
    hentPersonByFødselsnummer: () => Promise.resolve({ status: 200, body: personByFnr }),
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

describe('oppslag på person', () => {
    test('med aktørId kaller spesialistClient.hentPersonByAktørId', async () => {
        const requestWithAktørId = {
            headers: { [personLookup.personIdHeaderName]: '123' },
            session: {},
        };
        await personLookup.finnPerson(requestWithAktørId, mockResponse);

        expect(personFromResponse()).toStrictEqual({ ...personByAktørId, tildeltTil: undefined });
    });

    test('med fødselsnummer kaller spesialistClient.hentPersonByFødselsnummer', async () => {
        const requestWithFnr = {
            headers: { [personLookup.personIdHeaderName]: '11031888001' },
            session: {},
        };
        await personLookup.finnPerson(requestWithFnr, mockResponse);

        expect(personFromResponse()).toStrictEqual({ ...personByFnr, tildeltTil: undefined });
    });
});

const personFromResponse = () => mockResponse.send.mock.calls[0][0].person;

afterEach(() => {
    expect(mockResponse.status.mock.calls[0]?.[0]).not.toBeGreaterThanOrEqual(500);
});
