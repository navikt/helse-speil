export interface ServerConfig {
    port: number;
    sessionSecret?: string;
    spesialistBaseUrl: string;
    flexjarBaseUrl: string;
}

export interface AppConfig {
    server: ServerConfig;
}

export type OnBehalfOf = { hentFor: (tjenesteId: string, token: string) => Promise<string> };

export interface AuthError extends Error {
    statusCode: number;
    cause?: unknown;
}
