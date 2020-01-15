import request from 'request-promise-native';
import logger from '../logging';
import uuid from 'uuid/v4';
import { NavConfig } from '../types';
import { StsClient } from '../auth/stsClient';

export interface AktørIdLookup {
    init: (stsclient: StsClient, config: NavConfig) => void;
    hentAktørId: (fnr: string) => Promise<string>;
    hentFnr: (aktørId: string) => Promise<string>;
}

interface AktørIdLookupTestFunctions {
    _mapToAktørId: (resposne: IdentResponseMap, fnr: string) => Ident;
    _mapToFnr: (resposne: IdentResponseMap, aktørId: string) => Ident;
    _maskIdentifier: (identifier: string) => string;
}

interface IdentResponse {
    identer: Ident[];
    feilmelding?: string;
}

interface Ident {
    ident: string;
    identgruppe: string;
}

type IdentResponseMap = {
    [key: string]: IdentResponse;
};

interface IdentType {
    name: string;
    key: string;
}

let aktørregisterUrl: string;
let stsClient: StsClient;

const init = (stsclient: StsClient, config: NavConfig) => {
    stsClient = stsclient;
    aktørregisterUrl = config.aktoerregisterUrl!;
};

const hentAktørId = async (fnr: string) => {
    const response = await fetchFromAktørregisteret(fnr);
    return mapToAktørId(response, fnr);
};

const hentFnr = async (aktørId: string) => {
    const response = await fetchFromAktørregisteret(aktørId);
    return mapToFnr(response, aktørId);
};

const fetchFromAktørregisteret = async (ident: string) => {
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

const mapToIdentType = (response: IdentResponseMap, value: string, identType: IdentType) => {
    const identResponse: IdentResponse = response?.[value];
    const identer = identResponse?.identer;

    if (identer === undefined || identer.length === 0) {
        logger.error(`lookup failed: '${identResponse.feilmelding || 'unknown error'}`);
        return Promise.reject(`${identType.name} not found`);
    } else {
        const ident = identer
            .filter(ident => ident.identgruppe === identType.key)
            .map(ident => ident.ident)[0];
        logger.info(
            `Retrieved ${identType.name} '${maskIdentifier(ident)}' for ${
                identType.name === 'NNIN' ? 'AktørId' : 'NNIN'
            } '${maskIdentifier(value)}'.`
        );
        return Promise.resolve(ident);
    }
};

const mapToAktørId = (response: IdentResponseMap, fnr: string) => {
    return mapToIdentType(response, fnr, { name: 'AktørId', key: 'AktoerId' });
};

const mapToFnr = (response: IdentResponseMap, aktørId: string) => {
    return mapToIdentType(response, aktørId, { name: 'NNIN', key: 'NorskIdent' });
};

const maskIdentifier = (identifier: string): string => {
    const length = identifier.length;
    const numberOfMaskCharacters = Math.floor(length / 3) + 1;
    return (
        identifier.substring(0, numberOfMaskCharacters) +
        '*'.repeat(numberOfMaskCharacters) +
        identifier.substring(numberOfMaskCharacters * 2)
    );
};

export default {
    init,
    hentAktørId,
    hentFnr,
    _mapToAktørId: mapToAktørId,
    _mapToFnr: mapToFnr,
    _maskIdentifier: maskIdentifier
};
