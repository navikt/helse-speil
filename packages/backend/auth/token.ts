import { Request } from 'express';

import { getToken, requestOboToken } from '@navikt/oasis';

import config from '../config';

export const requestAzureOboToken = async (
    token: string,
    scope: string,
): Promise<ReturnType<typeof requestOboToken>> => {
    if (config.development) {
        const token = await fetch('http://localhost:4321/local-token')
            .then((it) => it.text())
            .catch(() => 'et slags token');
        return {
            ok: true,
            token: token,
        };
    }

    return await requestOboToken(token, scope);
};

export const getAuthToken = (req: Request): string | null => {
    if (config.development) {
        return 'et slags token';
    }

    return getToken(req);
};
