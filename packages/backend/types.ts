import { Request } from 'express';
import { Session } from 'express-session';
import { ResponseType } from 'openid-client';

export interface Helsesjekk {
    redis: boolean;
}

export interface OidcConfig {
    wellKnownEndpoint: string;
    tokenEndpoint: string;
    clientID: string;
    clientIDSpesialist: string;
    clientIDFlexjar: string;
    modiaApiScope: string;
    responseType: ResponseType[];
    clientSecret: string;
    scope: string;
    logoutUrl: string;
}

export interface ServerConfig {
    port: number;
    sessionSecret?: string;
    spesialistBaseUrl: string;
    spesialistWsUrl: string;
    flexjarBaseUrl: string;
    modiaBaseUrl: string;
}

export interface RedisConfig {
    url: string;
    username: string;
    password: string;
}

export interface AppConfig {
    oidc: OidcConfig;
    redis: object;
    server: ServerConfig;
}

export type OnBehalfOf = { hentFor: (tjenesteId: string, session: SpeilSession, token: string) => Promise<string> };

export interface SpeilSession extends Session {
    wantedPathBeforeAuth?: string;
    speilToken: string;
    refreshToken: string;
    oboTokens: { [clientId: string]: string | undefined };
    nonce: string;
    state: string;
    user: string;
}

export interface SpeilRequest extends Request {
    session: SpeilSession;
}

export interface AuthError extends Error {
    statusCode: number;
    cause?: unknown;
}
