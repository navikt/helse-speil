'use strict'

require('dotenv').config()

exports.oidc = {
   clientID: process.env.CLIENT_ID || "unknown",
   tenantID: process.env.TENANT_ID || "unknown",
   clientIDSpade: process.env.CLIENT_ID_SPADE || "unknown",
   identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
   responseType: 'code id_token',
   responseMode: 'form_post',
   redirectUrl: process.env.REDIRECT_URL || "http://localhost",
   allowHttpForRedirectUrl: true,
   clientSecret: process.env.CLIENT_SECRET || "unknown",
   validateIssuer: false,
   issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`,
   passReqToCallback: true,
   useCookieInsteadOfSession: true,
   cookieEncryptionKeys: [
      { key: `${process.env.KEY_1 || "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}`, iv: `${process.env.IV_1 || "123456789101"}` },
      { key: `${process.env.KEY_2 || "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"}`, iv: `${process.env.IV_2 || "123456789101"}` }
   ],
   scope: [
      'profile',
      'openid',
      'email',
      `${process.env.CLIENT_ID_SPADE}/user_impersonation`
   ],
   nonceLifetime: null,
   nonceMaxAmount: 5,
   clockSkew: null,
   logingLevel: "info"
}

exports.destroySessionUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${process.env.REDIRECT_URL}`

exports.server = {
   port: 3000
}
