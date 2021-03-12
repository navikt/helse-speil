'use strict';

import { OidcConfig, ServerConfig } from './types';
import env from 'dotenv';
import fs from 'fs';

const AZURE_PATH = '/var/run/secrets/nais.io/azure';

const readAzureCredential = (name: string): string => {
    try {
        return fs.readFileSync(`${AZURE_PATH}/${name}`, { encoding: 'utf-8', flag: 'r' });
    } catch (e) {
        console.warn(`Fant ikke ${name} i ${AZURE_PATH}, defaulter til 'unknown'`);
        return 'unknown';
    }
};

env.config();

const speilScope = fs.existsSync(`${AZURE_PATH}/client_id`) ? `${readAzureCredential('client_id')}/.default` : '';
const providerBaseUrl = `https://login.microsoftonline.com/${process.env.AZURE_APP_TENANT_ID ?? process.env.TENANT_ID}`;

const oidc: OidcConfig = {
    wellKnownEndpoint:
        process.env.AZURE_APP_WELL_KNOWN_URL ?? `${providerBaseUrl}/v2.0/.well-known/openid-configuration`,
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT ?? `${providerBaseUrl}/oauth2/v2.0/token`,
    clientID: process.env.AZURE_APP_CLIENT_ID ?? readAzureCredential('client_id'),
    clientIDSpesialist: process.env.CLIENT_ID_SPESIALIST || 'unknown',
    responseType: ['code'],
    redirectUrl: process.env.REDIRECT_URL,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET ?? readAzureCredential('client_secret'),
    scope: `profile offline_access openid email ${speilScope}`,
    requiredGroup: process.env.REQUIRED_GROUP,
};

const server: ServerConfig = {
    port: process.env.SPEIL_BACKEND_PORT ? parseInt(process.env.SPEIL_BACKEND_PORT) : 3000,
    sessionSecret: process.env.SESSION_SECRET,
};

const redis = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
};

export default {
    oidc,
    redis,
    server,
};
