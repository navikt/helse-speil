'use strict';

const setup = app => {
    app.disable('x-powered-by');
    app.use((req, res, next) => {
        res.header('X-Frame-Options', 'DENY');
        if (process.env.NODE_ENV === 'development') {
            res.header('Access-Control-Allow-Origin', req.header('Origin'));
        }
        res.header('X-Xss-Protection', '1; mode=block');
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('Referrer-Policy', 'no-referrer');

        res.header(
            'Content-Security-Policy',
            "default-src 'self' data:; style-src 'self' data: 'unsafe-inline'; connect-src 'self'"
        );
        res.header(
            'X-WebKit-CSP',
            "default-src 'self' data:; style-src 'self' data: 'unsafe-inline'; connect-src 'self'"
        );
        res.header(
            'X-Content-Security-Policy',
            "default-src 'self' data:; style-src 'self' data: 'unsafe-inline'; connect-src 'self'"
        );

        res.header(
            'Feature-Policy',
            "geolocation 'none'; microphone 'none'; camera 'none'"
        );
        if (process.env.NODE_ENV === 'development') {
            res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
        }
        next();
    });
};

module.exports = {
    setup: setup
};
