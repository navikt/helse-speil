import { IncomingMessage } from 'http';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ZodError, z } from 'zod/v4';

import { getToken, requestAzureOboToken, validateAzureToken } from '@navikt/oasis';

import { erLokal } from '@/env';
import { logger } from '@/logger';
import { Maybe } from '@io/graphql';
import { metrics } from '@observability/metrics';

type TokenPayload = z.infer<typeof tokenPayloadSchema>;
const tokenPayloadSchema = z.object({
    oid: z.string(),
    preferred_username: z.string(),
    name: z.string(),
    NAVident: z.string(),
    groups: z.array(z.string()),
});

export async function getTokenPayload(): Promise<TokenPayload> {
    if (erLokal) {
        return {
            oid: '11111111-2222-3333-4444-555555555555',
            preferred_username: 'local-username',
            name: 'Utvikler, Lokal',
            NAVident: 'A123456',
            groups: ['local-group'],
        };
    }

    const token = hentWonderwallToken(await headers());
    if (!token) {
        // Wonderwall sin autoLogin: true gjør denne casen egentlig umulig
        redirect('/oauth2/login');
    }

    const validationResult = await validateAzureToken(token);
    if (!validationResult.ok) {
        if (validationResult.errorType === 'token expired') {
            redirect('/oauth2/login');
        }

        metrics.authErrorCounter.inc({ type: 'invalid-jwt' }, 1);
        throw new Error(`JWT invalid, validation failed: ${validationResult.error.message}`, {
            cause: validationResult.error,
        });
    }

    try {
        return tokenPayloadSchema.parse({
            oid: validationResult.payload.oid,
            preferred_username: validationResult.payload.preferred_username,
            name: validationResult.payload.name,
            NAVident: validationResult.payload.NAVident,
            groups: validationResult.payload.groups,
        } satisfies Record<keyof TokenPayload, unknown>);
    } catch (e) {
        metrics.authErrorCounter.inc({ type: 'parse-error' }, 1);

        if (e instanceof ZodError) {
            logger.sikker.error(
                `Klarte ikke å parse payloaden fra tokenet til ${validationResult.payload.preferred_username}\n\n${`The following envs are missing: ${
                    e.issues
                        .filter((it) => it.message === 'Required')
                        .map((it) => it.path.join('.'))
                        .join(', ') || 'None are missing, but zod is not happy. Look at cause'
                }`}`,
            );
            logger.error('Failed to parse token payload', e);
        } else {
            logger.error('Unknown error: Failed to parse token payload', e);
        }

        throw e;
    }
}

export async function byttTilOboToken(token: string, scope: string): Promise<ReturnType<typeof requestAzureOboToken>> {
    if (erLokal) {
        return {
            ok: true,
            token: 'fake-local-obo-token',
        };
    }

    metrics.oboCounter.inc({ target_client_id: scope }, 1);
    return requestAzureOboToken(token, scope);
}

export const hentWonderwallToken = (req: Request | IncomingMessage | Headers): Maybe<string> => {
    if (erLokal) {
        return 'fake-local-wonderwall-token';
    }

    return getToken(req);
};
