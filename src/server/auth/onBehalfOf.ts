import request from 'request-promise-native';
import { OidcConfig } from '../types';

interface Instrumentation {
    onBehalfOfCounter: Function;
}

interface Counter {
    inc: (id: string) => void;
}

let config: OidcConfig;
let instrumentation: Instrumentation;
let counter: Counter;

const factory = (oidcConfig: OidcConfig, _instrumentation: Instrumentation) => {
    config = oidcConfig;
    instrumentation = _instrumentation;
    counter = instrumentation.onBehalfOfCounter();
    return {
        hentFor
    };
};

const hentFor = async (targetClientId: string, accessToken: string) => {
    counter.inc(targetClientId);

    if (process.env.NODE_ENV === 'development') return '';

    const options = {
        uri: `${config.providerBaseUrl}/oauth2/v2.0/token`,
        json: true,
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            client_id: config.clientID, // our own
            client_secret: config.clientSecret,
            assertion: accessToken,
            scope: `api://${targetClientId}/.default`, // the app we're reaching out to
            requested_token_use: 'on_behalf_of'
        }
    };
    const response = await request.post(options);
    return response.access_token;
};

export default { factory };
