'use strict';

require('dotenv').config();

exports.oidc = {
    clientID: process.env.CLIENT_ID || 'unknown',
    clientIDSpade: process.env.CLIENT_ID_SPADE || 'unknown',
    identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
    responseType: ['code'],
    redirectUrl: process.env.REDIRECT_URL || 'http://localhost',
    clientSecret: process.env.CLIENT_SECRET || 'unknown',
    issuer: [`https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`],
    scope: `profile openid email ${process.env.CLIENT_ID_SPADE}/user_impersonation`
};

exports.server = {
    port: 3000,
    sessionSecret: process.env.SESSION_SECRET
};
