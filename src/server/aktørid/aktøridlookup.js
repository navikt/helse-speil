const request = require('request-promise-native');
const { log } = require('../logging');
const uuid = require('uuid/v4');

let aktørregisterUrl;
let stsClient;

const init = (stsclient, config) => {
    stsClient = stsclient;
    aktørregisterUrl = config.aktoerregisterUrl;
};

const hentAktørId = async ssn => {
    const stsToken = await stsClient.hentAccessToken();

    const options = {
        uri: `${aktørregisterUrl}/api/v1/identer?gjeldende=true`,
        headers: {
            Authorization: `Bearer ${stsToken}`,
            Accept: 'application/json',
            'Nav-Call-Id': uuid(),
            'Nav-Consumer-Id': 'speil',
            'Nav-Personidenter': ssn
        },
        json: true
    };

    return request.get(options).then(response => mapResponse(response, ssn));
};

const mapResponse = (response, ssn) => {
    const identResponse = response && response[ssn];
    const identer = identResponse?.identer;

    if (identer === undefined || identer.length === 0) {
        log(`lookup failed: '${identResponse.feilmelding || 'unknown error'}`);
        return Promise.reject('AktørId not found');
    } else {
        const aktørId = identer
            .filter(ident => ident.identgruppe === 'AktoerId')
            .map(ident => ident.ident)[0];
        log(`Retrieved AktørId '${maskIdentifier(aktørId)}' for SSN '${maskIdentifier(ssn)}'.`);
        return Promise.resolve(aktørId);
    }
};

const maskIdentifier = identifier => {
    const length = identifier.length;
    const numberOfMaskCharacters = Math.floor(length / 3) + 1;
    const maskedIdentifier =
        identifier.substring(0, numberOfMaskCharacters) +
        '*'.repeat(numberOfMaskCharacters) +
        identifier.substring(numberOfMaskCharacters * 2);

    return maskedIdentifier;
};

module.exports = {
    init,
    hentAktørId,
    _mapResponse: mapResponse,
    _maskIdentifier: maskIdentifier
};
