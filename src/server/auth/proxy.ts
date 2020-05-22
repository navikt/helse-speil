'use strict';

import tunnel from 'tunnel';
import logger from '../logging';
import { custom, Issuer } from 'openid-client';
import { Agent } from 'http';

// @ts-ignore
const setup = (issuer: typeof Issuer, custom: typeof custom) => {
    let proxyAgent: Agent | null = null;
    if (process.env['HTTP_PROXY']) {
        let hostPort = process.env['HTTP_PROXY'].replace('https://', '').replace('http://', '').split(':', 2);
        proxyAgent = tunnel.httpsOverHttp({
            proxy: {
                host: hostPort[0],
                port: +hostPort[1],
            },
        });

        logger.info(`proxying requests via ${process.env['HTTP_PROXY']}`);

        // @ts-ignore
        issuer[custom.http_options] = function (options: { agent: Agent | null }) {
            options.agent = proxyAgent;
            return options;
        };
    } else {
        logger.info(`proxy is not active`);
    }

    return proxyAgent;
};

export default { setup };
