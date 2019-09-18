const sut = require('./aktøridlookup');

describe('response mapping', () => {
    test('maps OK response correctly', () => {
        const ssn = '140819';
        const aktørId = '1000036876618';

        expect(sut._mapToAktørId(okResponse(ssn, aktørId), ssn)).resolves.toEqual(aktørId);
    });

    test('rejects on error in response', () => {
        const ssn = '140819';

        const response = errorResponse(ssn);

        expect(sut._mapToAktørId(response, ssn)).rejects.toEqual('AktørId not found');
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
        expect(sut._maskIdentifier(input)).toEqual(result);
    });
});
