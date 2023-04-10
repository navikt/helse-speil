import { Response } from 'express';
import request from 'request-promise-native';

import config from '../config';
import { OidcConfig, OnBehalfOf } from '../types';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface SpesialistClient {
    execute: (speilToken: string, path: string, method: Method) => Promise<Response>;
}

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
}

type Method = 'get' | 'post' | 'delete';

const buildUri = (path: string) => spesialistBaseUrl + (path.startsWith('/') ? path : '/' + path);

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): SpesialistClient => ({
    execute: async (speilToken: string, path: string, method: Method): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: buildUri(path),
            method,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            resolveWithFullResponse: true,
            json: true,
        };

        return request(options);
    },
});
