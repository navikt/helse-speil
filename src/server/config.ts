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

const oidc: OidcConfig = {
    tenantID: process.env.TENANT_ID,
    providerBaseUrl: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientID: readAzureCredential('client_id'),
    clientIDSpesialist: process.env.CLIENT_ID_SPESIALIST || 'unknown',
    responseType: ['code'],
    redirectUrl: process.env.REDIRECT_URL || 'http://localhost',
    clientSecret: readAzureCredential('client_secret'),
    issuer: [`https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`],
    scope: `profile offline_access openid email ${readAzureCredential('client_id')}/.default`,
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
