import { ResponseType } from 'openid-client';
import { SpesialistClient } from './person/spesialistClient';
import { OverstyringClient } from './overstyring/overstyringClient';
import { Request } from 'express';
import { PersonClient } from './person/personClient';
import { Session } from 'express-session';

export interface Helsesjekk {
    redis: boolean;
}

export interface OidcConfig {
    wellKnownEndpoint: string;
    tokenEndpoint: string;
    clientID: string;
    clientIDSpesialist: string;
    responseType: ResponseType[];
    redirectUrl?: string;
    clientSecret: string;
    scope: string;
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
    redis: object;
    server: ServerConfig;
}

export type OnBehalfOf = { hentFor: (tjenesteId: string, token: string) => Promise<string> };

export interface PersonDependencies {
    spesialistClient: SpesialistClient;
    personClient: PersonClient;
    onBehalfOf: OnBehalfOf;
    config: AppConfig;
}

export interface OverstyringDependencies {
    overstyringClient: OverstyringClient;
}

export interface SpeilSession extends Session {
    speilToken: string;
    refreshToken: string;
    nonce: string;
    state: string;
    user: string;
}

export interface SpeilRequest extends Request {
    session: SpeilSession;
}

export interface AuthError extends Error {
    statusCode: number;
    cause?: any;
}
