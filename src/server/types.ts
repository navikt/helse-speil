import { ResponseType } from 'openid-client';
import { RedisClient } from 'redis';
import { SparkelClient } from './adapters/sparkelClient';
import { SpadeClient } from './adapters/spadeClient';
import { StsClient } from './auth/stsClient';
import { AktørIdLookup } from './aktørid/aktørIdLookup';
import { SpleisClient } from './person/spleisClient';

export interface OidcConfig {
    providerBaseUrl: string;
    clientID: string;
    clientIDSpade: string;
    clientIDSpleis: string;
    clientIDSpenn: string;
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
    spennUrl: string;
}

export type OnBehalfOf = { hentFor: (tjenesteId: string, token: string) => Promise<string> };

export interface PersonDependencies {
    spleisClient: SpleisClient;
    sparkelClient: SparkelClient;
    aktørIdLookup: AktørIdLookup;
    spadeClient: SpadeClient;
    stsClient: StsClient;
    onBehalfOf: OnBehalfOf;
    cache: RedisClient;
    config: AppConfig;
}
