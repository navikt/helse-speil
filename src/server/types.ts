import { ResponseType } from 'openid-client';
import { RedisClient } from 'redis';
import { SparkelClient } from './adapters/sparkelClient';
import { SpesialistClient } from './person/spesialistClient';
import { StsClient } from './auth/stsClient';
import { AktørIdLookup } from './aktørid/aktørIdLookup';
import { Storage } from './tildeling/storage';
import { Request } from 'express';

export interface OidcConfig {
    providerBaseUrl: string;
    clientID: string;
    clientIDSpesialist: string;
    responseType: ResponseType[];
    redirectUrl: string;
    clientSecret: string;
    issuer: string[];
    scope: string;
    tenantID?: string;
    requiredGroup?: string;
}

export interface ServerConfig {
    port: number;
    sessionSecret?: string;
}

export interface RedisConfig {
    host?: string;
    port?: string;
    password?: string;
}

export interface AppConfig {
    oidc: OidcConfig;
    nav: NavConfig;
    redis: object;
    server: ServerConfig;
}

export interface NavConfig {
    serviceUserName?: string;
    serviceUserPassword?: string;
    stsUrl: string;
    aktoerregisterUrl?: string;
}

export type OnBehalfOf = { hentFor: (tjenesteId: string, token: string) => Promise<string> };

export interface PersonDependencies {
    sparkelClient: SparkelClient;
    aktørIdLookup: AktørIdLookup;
    spesialistClient: SpesialistClient;
    storage: Storage;
    stsClient: StsClient;
    onBehalfOf: OnBehalfOf;
    cache: RedisClient;
    config: AppConfig;
}

export interface SpeilSession extends Express.Session {
    speilToken: string;
    refreshToken: string;
}

export interface SpeilRequest extends Request {
    session: SpeilSession;
}
