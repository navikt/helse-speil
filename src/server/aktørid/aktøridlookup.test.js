const aktøridlookup = require('./aktøridlookup');

describe('response mapping', () => {
    test('maps OK response correctly', () => {
        const ssn = '140819';
        const aktørId = '1000036876618';

        expect(aktøridlookup._mapResponse(okResponse(ssn, aktørId), ssn)).resolves.toEqual(aktørId);
    });

    test('rejects on error in response', () => {
        const ssn = '140819';

        const response = errorResponse(ssn);

        expect(aktøridlookup._mapResponse(response, ssn)).rejects.toEqual('AktørId not found');
    });

    const okResponse = (ssn, aktørId) => ({
        [ssn]: {
            identer: [
                {
                    identgruppe: 'AktoerId',
                    ident: aktørId
                }
            ]
        }
    });

    const errorResponse = ssn => ({
        [ssn]: {
            feilmelding: 'uh-oh'
        }
    });
});

describe('identifier masking', () => {
    test('obfuscates input', () => {
        const input = '01019512345';
        const result = '0101****345';
        expect(aktøridlookup._maskIdentifier(input)).toEqual(result);
    });
});
