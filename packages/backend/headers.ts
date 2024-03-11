import { Express } from 'express';

import config from './config';

('use strict');

const styleSource = 'https://fonts.googleapis.com';
const fontSource = 'https://fonts.gstatic.com https://cdn.nav.no';
const amplitudeSource = 'https://amplitude.nav.no';
const arbeidOgInntektSource = 'https://arbeid-og-inntekt.nais.adeo.no';
const navNo = 'https://*.nav.no';
const sanity = 'https://z9kr8ddn.api.sanity.io';
const cspString = `default-src 'self' data:; style-src 'self' ${styleSource} data: 'unsafe-inline'; connect-src 'self' ${arbeidOgInntektSource} ${navNo} ${sanity} blob: ${amplitudeSource}; font-src ${fontSource} 'self' data:`;

const setup = (app: Express) => {
    app.disable('x-powered-by');
    app.use((_req, res, next) => {
        res.header('X-Frame-Options', 'DENY');
        res.header('X-Xss-Protection', '1; mode=block');
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('Referrer-Policy', 'no-referrer');

        res.header('Content-Security-Policy', cspString);
        res.header('X-WebKit-CSP', cspString);
        res.header('X-Content-Security-Policy', cspString);

        res.header('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
        if (config.development) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
        }
        next();
    });
};

export default { setup };
