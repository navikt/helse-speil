'use strict';

const tunnel = require('tunnel');
const logger = require('../logging');

const setup = (Issuer, custom) => {
    let proxyAgent = null;
    if (process.env['HTTP_PROXY']) {
        let hostPort = process.env['HTTP_PROXY']
            .replace('https://', '')
            .replace('http://', '')
            .split(':', 2);
        proxyAgent = tunnel.httpsOverHttp({
            proxy: {
                host: hostPort[0],
                port: hostPort[1]
            }
        });

        logger.info(`proxying requests via ${process.env['HTTP_PROXY']}`);

        Issuer[custom.http_options] = function(options) {
            options.agent = proxyAgent;
            return options;
        };
    } else {
        logger.info(`proxy is not active`);
    }

    return proxyAgent;
};

module.exports = {
    setup: setup
};
