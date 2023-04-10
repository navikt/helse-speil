import { Response } from 'express';
import request from 'request-promise-native';

import config from '../config';
import { OidcConfig, OnBehalfOf } from '../types';

const spesialistBaseUrl = config.server.spesialistBaseUrl;

export interface ExecuteOptions {
    speilToken: string;
    path: string;
    method: Method;
    body?: string;
}

export interface SpesialistClient {
    execute: (options: ExecuteOptions) => Promise<Response>;
}

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    DELETE = 'delete',
}

type Method = 'get' | 'post' | 'delete';

const buildUri = (path: string) => spesialistBaseUrl + (path.startsWith('/') ? path : '/' + path);

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): SpesialistClient => ({
    execute: async ({ speilToken, path, method, body }: ExecuteOptions): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: buildUri(path),
            method,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            resolveWithFullResponse: true,
            ...(body && { body }),
            json: true,
        };

        return request(options);
    },
});
