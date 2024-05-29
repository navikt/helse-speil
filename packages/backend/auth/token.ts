import { Request } from 'express';

import { getToken, requestOboToken } from '@navikt/oasis';

import config from '../config';

export const requestAzureOboToken = async (
    token: string,
    scope: string,
): Promise<ReturnType<typeof requestOboToken>> => {
    if (config.development) {
        return {
            ok: true,
            token: 'et slags obo token',
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
