'use strict';

const tunnel = require('tunnel');

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

        console.log(`proxying requests via ${process.env['HTTP_PROXY']}`);

        Issuer[custom.http_options] = function(options) {
            options.agent = proxyAgent;
            return options;
        };
    } else {
        console.log(`proxy is not active`);
    }

    return proxyAgent;
};

module.exports = {
    setup: setup
};
