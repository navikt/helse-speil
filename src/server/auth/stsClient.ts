import { NavConfig } from '../types';

import auth from './authSupport';
import request from 'request-promise-native';

export interface StsClient {
    init: (config: NavConfig) => void;
    hentAccessToken: () => Promise<string>;
}

let cachedAccessToken: string;
let authConfig: NavConfig;

const init = (config: NavConfig) => {
    authConfig = config;
    hentAccessToken().catch(err => {
        console.error(`Error during STS login: ${err}`);
    });
};

const hentAccessToken = async () => {
    if (!tokenNeedsRefresh()) {
        return Promise.resolve(cachedAccessToken);
    }

    const options = {
        uri: `${authConfig.stsUrl}/rest/v1/sts/token?grant_type=client_credentials&scope=openid`,
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(`${authConfig.serviceUserName}:${authConfig.serviceUserPassword}`).toString('base64')
        },
        json: true
    };
    const response = await request.get(options);
    cachedAccessToken = response.access_token;

    return cachedAccessToken;
};

const tokenNeedsRefresh = () => {
    return !cachedAccessToken || auth.willExpireInLessThan(30, cachedAccessToken);
};

export default {
    init,
    hentAccessToken
};
