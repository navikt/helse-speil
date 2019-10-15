const sut = require('./aktøridlookup');
const requestMock = require('request-promise-native');

describe('calling Aktørregisteret', () => {
    const stsClient = {
        hentAccessToken: () => Promise.resolve()
    };
    const config = {
        aktoerregisterUrl: ''
    };
    sut.init(stsClient, config);

    test('hentAktørId works', async () => {
        const nnin = '123';
        const expectedAktørId = '456';

        requestMock.prepareAktørregisteretResponse({
            [nnin]: {
                identer: [
                    {
                        identgruppe: 'AktoerId',
                        ident: expectedAktørId
                    }
                ]
            }
        });

        const resultingAktørId = await sut.hentAktørId(nnin);
        expect(resultingAktørId).toEqual(expectedAktørId);
    });

    test('hentFnr works', async () => {
        const aktørId = '456';
        const expectedNnin = '123';

        requestMock.prepareAktørregisteretResponse({
            [aktørId]: {
                identer: [
                    {
                        identgruppe: 'NorskIdent',
                        ident: expectedNnin
                    }
                ]
            }
        });

        const resultingNnin = await sut.hentFnr(aktørId);
        expect(resultingNnin).toEqual(expectedNnin);
    });

    test('hentAktørId rejects on error in response', async () => {
        const aktørId = '123';
        requestMock.prepareAktørregisteretResponse({
            [aktørId]: {
                feilmelding: 'uh-oh'
            }
        });

        await expect(sut.hentAktørId(aktørId)).rejects.toEqual('AktørId not found');
    });

    test('hentFnr rejects on error in response', async () => {
        const nnin = '456';
        requestMock.prepareAktørregisteretResponse({
            [nnin]: {
                feilmelding: 'uh-oh'
            }
        });

        await expect(sut.hentFnr(nnin)).rejects.toEqual('NNIN not found');
    });
});

describe('identifier masking', () => {
    test('obfuscates input', () => {
        const input = '01019512345';
        const result = '0101****345';
        expect(sut._maskIdentifier(input)).toEqual(result);
    });
});
