'use strict';

const styleSource = 'https://fonts.googleapis.com';
const fontSource = 'https://fonts.gstatic.com';
const cspString = `default-src 'self' data:; style-src 'self' ${styleSource} data: 'unsafe-inline'; connect-src 'self'; font-src ${fontSource} 'self' data:`;

const setup = app => {
    app.disable('x-powered-by');
    app.use((req, res, next) => {
        res.header('X-Frame-Options', 'DENY');
        res.header('X-Xss-Protection', '1; mode=block');
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('Referrer-Policy', 'no-referrer');

        res.header('Content-Security-Policy', cspString);
        res.header('X-WebKit-CSP', cspString);
        res.header('X-Content-Security-Policy', cspString);

        res.header('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
        if (process.env.NODE_ENV === 'development') {
            res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, nav-person-id, innsyn'
            );
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
        }
        next();
    });
};

module.exports = {
    setup: setup
};
