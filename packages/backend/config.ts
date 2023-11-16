import env from 'dotenv';

import { OidcConfig, RedisConfig, ServerConfig } from './types';

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
    spesialistBaseUrl: process.env.SPESIALIST_BASE_URL || 'http://spesialist',
};

const redis: RedisConfig = {
    url: process.env.REDIS_URI_SESSIONS!,
    username: process.env.REDIS_USERNAME_SESSIONS!,
    password: process.env.REDIS_PASSWORD_SESSIONS!,
};

export default {
    oidc,
    redis,
    server,
};
