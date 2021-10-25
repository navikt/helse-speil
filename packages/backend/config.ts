import env from 'dotenv';

import { OidcConfig, ServerConfig } from './types';

('use strict');

env.config();

const oidc: OidcConfig = {
    wellKnownEndpoint: process.env.AZURE_APP_WELL_KNOWN_URL || 'unknown',
    tokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT || 'unknown',
    clientID: process.env.AZURE_APP_CLIENT_ID || 'unknown',
    clientIDSpesialist: process.env.CLIENT_ID_SPESIALIST || 'unknown',
    responseType: ['code'],
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET || 'unknown',
    scope: `profile offline_access openid email ${process.env.AZURE_APP_CLIENT_ID}/.default`,
    logoutUrl: process.env.LOGOUT_URL ?? 'https://navno.sharepoint.com/sites/intranett',
};

const server: ServerConfig = {
    port: process.env.SPEIL_BACKEND_PORT ? parseInt(process.env.SPEIL_BACKEND_PORT) : 3000,
    sessionSecret: process.env.SESSION_SECRET,
    spesialistBaseUrl: process.env.SPESIALIST_BASE_URL || 'http://spesialist.tbd.svc.nais.local',
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
