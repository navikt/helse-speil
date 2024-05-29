import { ResponseType } from 'openid-client';

export interface OidcConfig {
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
