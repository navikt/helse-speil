export interface OidcConfig {
    clientIDSpesialist: string;
    clientIDFlexjar: string;
    modiaApiScope: string;
}

export interface ServerConfig {
    port: number;
    sessionSecret?: string;
    spesialistBaseUrl: string;
    spesialistWsUrl: string;
    flexjarBaseUrl: string;
    modiaBaseUrl: string;
}
