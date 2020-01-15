'use strict';

import { NavConfig, OidcConfig, ServerConfig } from './types';
import env from 'dotenv';

env.config();

const oidc: OidcConfig = {
    tenantID: process.env.TENANT_ID,
    providerBaseUrl: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientID: process.env.CLIENT_ID || 'unknown',
    clientIDSpade: process.env.CLIENT_ID_SPADE || 'unknown',
    clientIDSpleis: process.env.CLIENT_ID_SPLEIS || 'unknown',
    clientIDSpenn: process.env.CLIENT_ID_SPENN || 'unknown',
    responseType: ['code'],
    redirectUrl: process.env.REDIRECT_URL || 'http://localhost',
    clientSecret: process.env.CLIENT_SECRET || 'unknown',
    issuer: [`https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`],
    scope: `profile openid email ${process.env.CLIENT_ID}/.default`,
    requiredGroup: process.env.REQUIRED_GROUP
};

const server: ServerConfig = {
    port: 3000,
    sessionSecret: process.env.SESSION_SECRET
};

const nav: NavConfig = {
    serviceUserName: process.env.SERVICE_USER_NAME,
    serviceUserPassword: process.env.SERVICE_USER_PASSWORD,
    stsUrl: process.env.STS_URL || 'http://security-token-service.svc.nais.local',
    aktoerregisterUrl: process.env.AKTOERREGISTER_URL,
    spennUrl: process.env.SPENN_URL || 'http://spenn.svc.nais.local'
};

const redis = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
};

export default {
    nav,
    oidc,
    redis,
    server
};
