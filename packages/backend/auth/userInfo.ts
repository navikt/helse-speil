import config from 'backend/config';
import { Request, Response } from 'express';

import { getToken, validateAzureToken } from '@navikt/oasis';

type UserInfo = {
    name: string;
    email: string;
    ident: string;
    oid: string;
};

export async function getLoggedInUserInfo(req: Request, res: Response): Promise<void> {
    if (config.development) {
        res.status(200);
        res.json({
            name: 'S. A. Ksbehandler',
            email: 'dev@nav.no',
            NAVident: 'dev-ident',
            oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
        });
    }

    const token = getToken(req);
    if (!token) {
        res.sendStatus(401);
        return;
    }

    const validationResult = await validateAzureToken(token);
    if (!validationResult.ok) {
        res.sendStatus(401);
        return;
    }

    res.status(200);
    res.json(getUserInfoFromToken(token));
    return;
}

export function getUserInfoFromToken(token: string): UserInfo {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return {
        name: decoded.name,
        ident: decoded.NAVident,
        email: decoded.email,
        oid: decoded.oid,
    };
}
