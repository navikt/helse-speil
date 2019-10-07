const request = require('request-promise-native');
const logger = require('../logging');
const uuid = require('uuid/v4');

let aktørregisterUrl;
let stsClient;

const init = (stsclient, config) => {
    stsClient = stsclient;
    aktørregisterUrl = config.aktoerregisterUrl;
};

const hentAktørId = async ssn => {
    const response = await fetchFromAktørregisteret(ssn);
    return mapToAktørId(response, ssn);
};

const hentFnr = async aktørId => {
    const response = await fetchFromAktørregisteret(aktørId);
    return mapToFnr(response, aktørId);
};

const fetchFromAktørregisteret = async ident => {
    const stsToken = await stsClient.hentAccessToken();

    const options = {
        uri: `${aktørregisterUrl}/api/v1/identer?gjeldende=true`,
        headers: {
            Authorization: `Bearer ${stsToken}`,
            Accept: 'application/json',
            'Nav-Call-Id': uuid(),
            'Nav-Consumer-Id': 'speil',
            'Nav-Personidenter': ident
        },
        json: true
    };

    return request.get(options);
};

const mapToIdentType = (response, value, identType) => {
    const identResponse = response?.[value];
    const identer = identResponse?.identer;

    if (identer === undefined || identer.length === 0) {
        logger.error(`lookup failed: '${identResponse.feilmelding || 'unknown error'}`);
        return Promise.reject(`${identType.name} not found`);
    } else {
        const ident = identer
            .filter(ident => ident.identgruppe === identType.key)
            .map(ident => ident.ident)[0];
        logger.info(`Retrieved ${identType.name} '${maskIdentifier(ident)}' for ${identType.name} '${maskIdentifier(ident)}'.`);
        return Promise.resolve(ident);
    }
};

const mapToAktørId = (response, fnr) => {
    return mapToIdentType(response, fnr, { name: 'AktørId', key: 'AktoerId' });
};

const mapToFnr = (response, aktørId) => {
    return mapToIdentType(response, aktørId, { name: 'NNIN', key: 'NorskIdent' });
};

const maskIdentifier = identifier => {
    const length = identifier.length;
    const numberOfMaskCharacters = Math.floor(length / 3) + 1;
    return identifier.substring(0, numberOfMaskCharacters) + '*'.repeat(numberOfMaskCharacters) + identifier.substring(numberOfMaskCharacters * 2);
};

module.exports = {
    init,
    hentAktørId,
    hentFnr,
    _mapToAktørId: mapToAktørId,
    _mapToFnr: mapToFnr,
    _maskIdentifier: maskIdentifier
};
