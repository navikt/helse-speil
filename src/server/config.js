exports.oidc = {
   clientID: process.env.CLIENT_ID,
   tenantID: process.env.TENANT_ID,
   clientIDSpade: process.env.CLIENT_ID_SPADE,
   identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0/.well-known/openid-configuration`,
   responseType: 'code id_token',
   responseMode: 'form_post',
   redirectUrl: process.env.REDIRECT_URL,
   allowHttpForRedirectUrl: true,
   clientSecret: process.env.CLIENT_SECRET,
   validateIssuer: true,
   issuer: `https://sts.windows.net/${process.env.TENANT_ID}/v2.0`,
   passReqToCallback: true,
   useCookieInsteadOfSession: true,
   cookieEncryptionKeys: [
      { key: `${process.env.KEY_1}`, iv: `${process.env.IV_1}` },
      { key: `${process.env.KEY_2}`, iv: `${process.env.IV_2}` }
   ],
   scope: [
      'profile',
      'openid',
      'email',
      `${process.env.CLIENT_ID_SPADE}/user_impersonation`
   ],
   nonceLifetime: null,
   nonceMaxAmount: 5,
   clockSkew: null
}

exports.destroySessionUrl = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${process.env.REDIRECT_URL}`

exports.server = {
   port: 3000
}
