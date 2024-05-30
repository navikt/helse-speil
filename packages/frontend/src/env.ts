import process from 'process';
import { ZodError, z } from 'zod';

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export const publicEnvSchema = z.object({});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export const serverEnvSchema = z.object({
    FLEXJAR_SCOPE: z.string(),
    FLEXJAR_BASEURL: z.string(),
    MODIA_SCOPE: z.string(),
    MODIA_BASEURL: z.string(),
    SPESIALIST_SCOPE: z.string(),
    SPESIALIST_BASEURL: z.string(),
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
export const browserEnv = publicEnvSchema.parse({} satisfies Record<keyof PublicEnv, string | undefined>);

const getRawServerConfig = (): Partial<unknown> =>
    ({
        FLEXJAR_SCOPE: process.env.CLIENT_ID_FLEXJAR,
        FLEXJAR_BASEURL: process.env.FLEXJAR_BASE_URL,
        MODIA_SCOPE: process.env.MODIA_API_SCOPE,
        MODIA_BASEURL: process.env.MODIA_BASE_URL,
        SPESIALIST_SCOPE: process.env.SPESIALIST_CLIENT_ID,
        SPESIALIST_BASEURL: process.env.SPESIALIST_BASE_URL,
        // Provided by nais
        AZURE_APP_CLIENT_ID: process.env.AZURE_APP_CLIENT_ID,
        AZURE_APP_CLIENT_SECRET: process.env.AZURE_APP_CLIENT_SECRET,
        AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
        AZURE_APP_WELL_KNOWN_URL: process.env.AZURE_APP_WELL_KNOWN_URL,
        AZURE_APP_PRE_AUTHORIZED_APPS: process.env.AZURE_APP_PRE_AUTHORIZED_APPS,
    }) satisfies Record<keyof ServerEnv, string | undefined>;

/**
 * Server envs are lazy loaded and verified using Zod.
 */
export function getServerEnv(): ServerEnv & PublicEnv {
    try {
        return { ...serverEnvSchema.parse(getRawServerConfig()), ...publicEnvSchema.parse(browserEnv) };
    } catch (e) {
        if (e instanceof ZodError) {
            throw new Error(
                `The following envs are missing: ${
                    e.errors
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

export const isLocal = process.env.NODE_ENV !== 'production';
