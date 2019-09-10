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
    scope: `profile openid email ${process.env.CLIENT_ID_SPADE}/user_impersonation`,
    requiredGroup: process.env.REQUIRED_GROUP
};

exports.s3 = {
    s3url: process.env.S3_URL || 'http://s3.nais-rook.svc.nais.local',
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY
};

exports.server = {
    port: 3000,
    sessionSecret: process.env.SESSION_SECRET
};

exports.nav = {
    serviceUserName: process.env.SERVICE_USER_NAME,
    serviceUserPassword: process.env.SERVICE_USER_PASSWORD,
    stsUrl: process.env.STS_URL || 'http://security-token-service.svc.nais.local'
};
