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

const mapToAktørId = (response, ssn) => {
    const identResponse = response && response[ssn];
    const identer = identResponse?.identer;

    if (identer === undefined || identer.length === 0) {
        logger.error(`lookup failed: '${identResponse.feilmelding || 'unknown error'}`);
        return Promise.reject('AktørId not found');
    } else {
        const aktørId = identer
            .filter(ident => ident.identgruppe === 'AktoerId')
            .map(ident => ident.ident)[0];
        logger.info(`Retrieved AktørID '${maskIdentifier(aktørId)}' for NNIN '${maskIdentifier(ssn)}'.`);
        return Promise.resolve(aktørId);
    }
};

const mapToFnr = (response, aktørId) => {
    const identResponse = response && response[aktørId];
    const identer = identResponse?.identer;

    if (identer === undefined || identer.length === 0) {
        logger.error(`lookup failed: '${identResponse.feilmelding || 'unknown error'}`);
        return Promise.reject('NNIN not found');
    } else {
        const fnr = identer
            .filter(ident => ident.identgruppe === 'NorskIdent')
            .map(ident => ident.ident)[0];
        logger.info(`Retrieved NNIN '${maskIdentifier(fnr)}' for AktørID '${maskIdentifier(aktørId)}'.`);
        return Promise.resolve(fnr);
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
    hentFnr,
    _mapToAktørId: mapToAktørId,
    _mapToFnr: mapToFnr,
    _maskIdentifier: maskIdentifier
};
