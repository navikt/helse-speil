import { ZodError, z } from 'zod/v4';

export type PublicEnv = z.infer<typeof browserEnvSchema>;
export const browserEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENV: z.enum(['test', 'dev', 'lokal', 'lokal-spesialist', 'lokal-sporhund', 'prod', 'mock']),
    NEXT_PUBLIC_ASSET_PREFIX: z.string().optional(),
    NEXT_PUBLIC_TELEMETRY_URL: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
    SANITY_DATASET: z.enum(['production', 'local-spalten', 'local-mock']),
    SANITY_READ_DATASETS_TOKEN: z.string(),
    FLEXJAR_SCOPE: z.string(),
    FLEXJAR_BASEURL: z.string(),
    MODIA_SCOPE: z.string(),
    MODIA_BASEURL: z.string(),
    SPARKEL_AAREG_SCOPE: z.string(),
    SPARKEL_AAREG_BASEURL: z.string(),
    SPESIALIST_SCOPE: z.string(),
    SPESIALIST_BASEURL: z.string(),
    SPORHUND_SCOPE: z.string(),
    SPORHUND_BASEURL: z.string(),
    SYFO_SCOPE: z.string().optional(),
    SYFO_BASEURL: z.string().optional(),
    AZURE_APP_CLIENT_ID: z.string(),
    AZURE_APP_CLIENT_SECRET: z.string(),
    AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: z.string(),
    AZURE_APP_WELL_KNOWN_URL: z.string(),
    AZURE_APP_PRE_AUTHORIZED_APPS: z.string(),
});

/**
 * These envs are available in the browser. They are replaced during the bundling step by NextJS.
 *
 * They MUST be provided during the build step.
 */
export const browserEnv = browserEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENV: process.env.NEXT_PUBLIC_RUNTIME_ENV,
    NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    NEXT_PUBLIC_TELEMETRY_URL: process.env.NEXT_PUBLIC_TELEMETRY_URL,
} satisfies Record<keyof PublicEnv, string | undefined>);

const getRawServerConfig = (): Partial<unknown> => {
    const backend = backendVariant();
    return {
        SANITY_DATASET: process.env.SANITY_DATASET,
        SANITY_READ_DATASETS_TOKEN: process.env.SANITY_READ_DATASETS_TOKEN,
        FLEXJAR_SCOPE: process.env.CLIENT_ID_FLEXJAR,
        FLEXJAR_BASEURL: process.env.FLEXJAR_BASE_URL,
        MODIA_SCOPE: process.env.MODIA_API_SCOPE,
        MODIA_BASEURL: process.env.MODIA_BASE_URL,
        SPARKEL_AAREG_SCOPE: process.env.SPARKEL_AAREG_SCOPE,
        SPARKEL_AAREG_BASEURL: process.env.SPARKEL_AAREG_BASEURL,
        SPESIALIST_SCOPE: process.env.CLIENT_ID_SPESIALIST,
        SPESIALIST_BASEURL:
            backend === 'deployed'
                ? process.env.SPESIALIST_BASE_URL
                : backend === 'lokal' || backend === 'lokal-spesialist'
                  ? 'http://localhost:8080'
                  : 'http://0.0.0.0:4321',
        SPORHUND_SCOPE: process.env.CLIENT_ID_SPORHUND,
        // I mock-modus brukes aldri denne URL-en – stubEllerVideresendTilSporhund returnerer stub-svar direkte
        SPORHUND_BASEURL:
            backend === 'deployed'
                ? process.env.SPORHUND_BASE_URL
                : backend === 'lokal' || backend === 'lokal-sporhund'
                  ? 'http://localhost:8282'
                  : 'http://localhost:8282',
        SYFO_SCOPE: process.env.SYFO_SCOPE,
        SYFO_BASEURL: process.env.SYFO_BASE_URL,
        // Provided by nais
        AZURE_APP_CLIENT_ID: process.env.AZURE_APP_CLIENT_ID,
        AZURE_APP_CLIENT_SECRET: process.env.AZURE_APP_CLIENT_SECRET,
        AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
        AZURE_APP_WELL_KNOWN_URL: process.env.AZURE_APP_WELL_KNOWN_URL,
        AZURE_APP_PRE_AUTHORIZED_APPS: process.env.AZURE_APP_PRE_AUTHORIZED_APPS,
    } satisfies Record<keyof ServerEnv, string | undefined>;
};

/**
 * Server envs are lazy loaded and verified using Zod.
 */
export function getServerEnv(): ServerEnv & PublicEnv {
    try {
        return { ...serverEnvSchema.parse(getRawServerConfig()), ...browserEnvSchema.parse(browserEnv) };
    } catch (e) {
        if (e instanceof ZodError) {
            throw new Error(
                `The following envs are missing: ${
                    e.issues
                        .filter((it) => it.message === 'Required')
                        .map((it) => it.path.join('.'))
                        .join(', ') || 'None are missing, but zod is not happy. Look at cause'
                }`,
                { cause: e },
            );
        } else {
            throw e;
        }
    }
}
const backendVariant = (): 'mock' | 'lokal' | 'lokal-spesialist' | 'lokal-sporhund' | 'deployed' => {
    switch (browserEnv.NEXT_PUBLIC_RUNTIME_ENV) {
        case 'test':
        case 'mock':
            return 'mock';
        case 'dev':
        case 'prod':
            return 'deployed';
        case 'lokal':
            return 'lokal';
        case 'lokal-spesialist':
            return 'lokal-spesialist';
        case 'lokal-sporhund':
            return 'lokal-sporhund';
    }
};

export const backend = backendVariant();
export const erDev = browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev';
export const erProd = browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'prod';

export const erUtvikling = backend !== 'deployed' || erDev;
export const sanityBaseUrl = () =>
    'https://z9kr8ddn.api.sanity.io/v2023-08-01/data/query/' + getServerEnv().SANITY_DATASET;
