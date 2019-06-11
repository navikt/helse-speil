'use strict'

const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { Issuer } = require('openid-client')
const { generators } = require('openid-client')
const { custom } = require('openid-client')
const tunnel = require('tunnel')
const request = require('request')
const prometheus = require('prom-client')
const fs = require('fs')

const config = require('./config')
const tokendecoder = require('./tokendecoder')

const app = express()
const port = config.server.port

const behandlingerFor = (aktorId, accessToken, callback) => {
  request.get(`http://spade.default.svc.nais.local/api/behandlinger/${aktorId}`, {
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    }
  }, (error, response, body) => {
    const erred = error || response.statusCode !== 200
    if (erred) {
      console.log(`Error during lookup, got ${response.statusCode} ${error || 'unknown error'} fom spade`)
    }

    callback({"status": response.statusCode, "data": erred ? error : body})
  })
}

let proxyAgent = null
if (process.env["HTTP_PROXY"]) {
    let hostPort = process.env["HTTP_PROXY"]
        .replace('https://', '')
        .replace('http://', '')
        .split(":", 2)
    proxyAgent = tunnel.httpsOverHttp({
        proxy: {
            host: hostPort[0],
            port: hostPort[1]
        }
    })

    console.log(`proxying requests via ${process.env["HTTP_PROXY"]}`)

    Issuer[custom.http_options] = function (options) {
        options.agent = proxyAgent
        return options
    }
} else {
    console.log(`proxy is not active`)
}

let azureClient = null
Issuer.discover(config.oidc.identityMetadata)
  .then((azure) => {
    console.log(`Discovered issuer ${azure.issuer}`)
    azureClient = new azure.Client({
      client_id: config.oidc.clientID,
      client_secret: config.oidc.clientSecret,
      redirect_uris: config.oidc.redirectUrl,
      response_types: config.oidc.responseType,
    })

      if (proxyAgent) {
          azure[custom.http_options] = function (options) {
              options.agent = proxyAgent
              return options
          }
          azureClient[custom.http_options] = function (options) {
              options.agent = proxyAgent
              return options
          }
      }
  })
  .catch ((err) => {
     console.log(`Failed to discover OIDC provider properties: ${err}`)
     process.exit(1)
  })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.disable('x-powered-by')
app.use(expressSession({ secret: config.server.sessionSecret }))
app.use('/static', express.static('dist'))
app.use((req, res, next) => {
   res.header('X-Frame-Options', 'DENY')
   if (process.env.NODE_ENV === 'development') {
      res.header('Access-Control-Allow-Origin', req.header('Origin'))
   }
   res.header('X-Xss-Protection', '1; mode=block')
   res.header('X-Content-Type-Options', 'nosniff')
   res.header('Referrer-Policy', 'no-referrer')
   res.header('Feature-Policy', 'geolocation \'none\'; microphone \'none\'; camera \'none\'')
   next()
})
if (process.env.NODE_ENV === 'development') {
   app.use('/mock-data', express.static('__mock-data__'))
}

const collectDefaultMetrics = prometheus.collectDefaultMetrics
collectDefaultMetrics({ timeout: 5000 })
app.get('/isAlive', (req, res) => res.send('alive'))
app.get('/isReady', (req, res) => res.send('ready'))
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(prometheus.register.metrics())
})

app.get('/login', (req, res) => {
   req.session.nonce = generators.nonce()
   const url = azureClient.authorizationUrl({
      scope: config.oidc.scope,
      redirect_uri: config.oidc.redirectUrl,
      response_type: config.oidc.responseType,
      response_mode: 'form_post',
      nonce: req.session.nonce
    })
    res.redirect(url)
})

app.post('/callback', (req, res) => {
   const params = azureClient.callbackParams(req)
   const nonce = req.session.nonce
   azureClient.callback(config.oidc.redirectUrl, params, { nonce })
      .then((tokenSet) => {
         res.cookie('speil', `${tokenSet['id_token']}`, { httpOnly: true, secure: true })
         req.session.spadeToken = tokenSet['access_token']
         res.redirect('/')
      })
      .catch((err) => {
         console.log(`error in oidc callback: ${err}`)
         req.session.destroy()
         res.sendStatus(403)
      })
})

app.get('/whoami', (req, res) => {
   if (process.env.NODE_ENV === 'development') {
      res.send({ name: `Sara Saksbehandler` });
   } else if (req.cookies['speil']) {
      res.send({ name: `${tokendecoder.username(req.cookies['speil'])}`})
   } else {
      res.sendStatus(401)
   }
})

 app.get('/behandlinger/:aktorId', (req, res) => {
   if (process.env.NODE_ENV === 'development') {
      fs.readFile('__mock-data__/behandlinger.json', (err, data) => {
         if (err) {
            console.log(err);
            res.sendStatus(500);
         }
         res.send(data);
       });
       return
   }
   const accessToken = req.session.spadeToken
   if (!accessToken) {
     res.sendStatus(403)
   } else {
     const aktorId = req.params.aktorId
     behandlingerFor(aktorId, accessToken, (behandlinger) => {
       res.status(behandlinger.status).send(behandlinger.data || 'Fant ingen behandlinger')
     })
   }
 })

app.get('/', (_, res) => {
   res.redirect('/static')
})

app.listen(port, () => console.log(`Speil backend listening on port ${port}!`))
