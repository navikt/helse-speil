import { Request } from 'express';
import { Client, TokenSet } from 'openid-client';
import util from 'util';

import config from '../config';
import logger from '../logging';
import { AuthError, SpeilRequest, SpeilSession } from '../types';

interface IsValidInProps {
    seconds: number;
    token?: string;
}

type ExpectedClaims = {
    [key: string]: string | string[];
    exp: string;
    groups: string[];
};
const isValidIn = ({ seconds, token }: IsValidInProps) => {
    if (!token) return false;
    const timeToCheck = Math.floor(Date.now() / 1000) + seconds;
    const expirationTime = parseInt(claimsFrom(token).exp);
    return timeToCheck < expirationTime;
};

const redirectUrl = (req: Request) => {
    if (config.development) return 'http://localhost:3000/oauth2/callback';
    return 'https://' + req.get('Host') + '/oauth2/callback';
};

const authError = (statusCode: number, reason: string, cause?: unknown): AuthError => {
    return {
        name: 'auth_error',
        message: reason,
        statusCode: statusCode,
        cause: cause,
    };
};

const validateOidcCallback = (req: SpeilRequest, azureClient: Client) => {
    if (req.body.code === undefined) {
        return Promise.reject(authError(400, 'missing data in POST after login'));
    }
    const params = azureClient.callbackParams(req);
    const nonce = req.session!.nonce;
    const state = req.session!.state;
    if (state == null) {
        logger.sikker.error(
            `'state' skulle ikke ha vært null.\nreq: ${util.inspect(req)}\nreq.session: ${util.inspect(req.session)}`,
        );
    }

    return azureClient
        .callback(redirectUrl(req), params, { nonce, state })
        .catch((err) => Promise.reject(authError(500, `Azure error: ${err.error_description}`, err)))
        .then((tokenSet: TokenSet) => retrieveTokens(tokenSet, 'access_token', 'id_token', 'refresh_token'))
        .then(([accessToken, idToken, refreshToken]) => {
            return [accessToken, idToken, refreshToken];
        });
};

const retrieveTokens = (tokenSet: TokenSet, ...tokenKeys: string[]): Promise<string[]> => {
    const tokens = tokenKeys.map((key) => tokenSet[key]);
    for (const key of tokenKeys) {
        if (tokenSet[key] === undefined) {
            return Promise.reject(authError(500, `Missing ${key} in response from Azure AD.`));
        }
    }
    return Promise.resolve(tokens as string[]);
};

const isMemberOf = (token: string, group?: string) => {
    const claims = claimsFrom(token);
    const groups = claims.groups;
    return groups.filter((element: string) => element === group).length === 1;
};

const valueFromClaim = <T extends string | string[]>(claim: string, token?: string): T => {
    if (token === undefined) {
        logger.info(`No token, cannot extract claim value '${claim}'`);
        return 'unknown value' as T;
    }
    try {
        return (claimsFrom(token)[claim] || 'unknown value') as T;
    } catch (err) {
        logger.error(`error while extracting value from claim '${claim}': ${err}`);
        return 'unknown value' as T;
    }
};
const claimsFrom = (token: string): ExpectedClaims => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

const createTokenForTest = () =>
    `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
        JSON.stringify({
            name: 'S. A. Ksbehandler',
            email: 'dev@nav.no',
            NAVident: 'dev-ident',
            oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
        }),
    ).toString('base64')}.bogussignature`;

const refreshAccessToken = async (azureClient: Client, session: SpeilSession): Promise<boolean> => {
    if (!session.refreshToken) return false;
    return await azureClient
        .refresh(session.refreshToken)
        .then((tokenSet: TokenSet) => retrieveTokens(tokenSet, 'access_token', 'refresh_token'))
        .then(([accessToken, refreshToken]) => {
            logger.sikker.info(`Refresher access token for ${session.user}`);
            session.speilToken = accessToken;
            session.refreshToken = refreshToken;
            return true;
        })
        .catch((errorMessage) => {
            logger.sikker.error(`Feilet refresh av access token for ${session.user}: ${errorMessage}`);
            return false;
        });
};

export default {
    isValidIn,
    redirectUrl,
    validateOidcCallback,
    isMemberOf,
    valueFromClaim,
    createTokenForTest,
    refreshAccessToken,
};
