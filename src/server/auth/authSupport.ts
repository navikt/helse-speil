import logger from '../logging';
import { ipAddressFromRequest } from '../requestData';
import { Request } from 'express';
import { Client, TokenSet } from 'openid-client';
import { OidcConfig, SpeilRequest, SpeilSession } from '../types';
import { speilUser } from '../person/personLookup';

interface IsValidInProps {
    seconds: number;
    token?: string;
}

const isValidIn = ({ seconds, token }: IsValidInProps) => {
    if (!token) return false;
    const timeToCheck = Math.floor(Date.now() / 1000) + seconds;
    const expirationTime = parseInt(claimsFrom(token)['exp'] as string);
    return timeToCheck < expirationTime;
};

const redirectUrl = (req: Request, oidc: OidcConfig) => {
    return oidc.redirectUrl ?? 'https://' + req.get('Host') + '/oauth2/callback';
};

const validateOidcCallback = (req: SpeilRequest, azureClient: Client, config: OidcConfig) => {
    if (req.body.code === undefined) {
        return Promise.reject('missing data in POST after login');
    }
    const params = azureClient.callbackParams(req);
    const nonce = req.session!.nonce;
    const state = req.session!.state;

    return azureClient
        .callback(redirectUrl(req, config), params, { nonce, state })
        .catch((err) => Promise.reject(`error in oidc callback: ${err}`))
        .then(async (tokenSet: TokenSet) => {
            const [accessToken, idToken, refreshToken] = await retrieveTokens(
                tokenSet,
                'access_token',
                'id_token',
                'refresh_token'
            ).catch((errorMessages) => {
                return Promise.reject(errorMessages);
            });

            const requiredGroup = config.requiredGroup;
            const username = valueFromClaim('name', idToken);
            if (accessToken && (requiredGroup === undefined || isMemberOf(accessToken, requiredGroup))) {
                logger.info(`User ${username} has been authenticated, from IP address ${ipAddressFromRequest(req)}`);
                return [accessToken, idToken, refreshToken];
            } else {
                return Promise.reject(`'${username}' is not member of '${requiredGroup}', denying access`);
            }
        });
};

const retrieveTokens = (tokenSet: TokenSet, ...tokenKeys: string[]): Promise<string[]> => {
    const tokens = tokenKeys.map((key) => tokenSet[key]);
    const errorMessages = checkAzureResponseContainsTokens(tokenSet, ...tokenKeys);

    if (errorMessages.length > 0) {
        return Promise.reject(`Access denied: ${errorMessages.join(' ')}`);
    }

    return Promise.resolve(tokens as string[]);
};

const checkAzureResponseContainsTokens = (tokenSet: TokenSet, ...tokens: string[]) =>
    [...tokens]
        .filter((tokenName) => tokenSet[tokenName] === undefined)
        .map((tokenName) => `Missing ${[tokenName]} in response from Azure AD.`);

const isMemberOf = (token: string, group?: string) => {
    const claims = claimsFrom(token);
    const groups = claims['groups'] as string[];
    return groups.filter((element: string) => element === group).length === 1;
};

const valueFromClaim = (claim: string, token?: string): string => {
    if (token === undefined) {
        logger.info(`No token, cannot extract claim value '${claim}'`);
        return 'unknown value';
    }
    try {
        return (claimsFrom(token)[claim] as string) || 'unknown value';
    } catch (err) {
        logger.error(`error while extracting value from claim '${claim}': ${err}`);
        return 'unknown value';
    }
};
const claimsFrom = (token: string): any => {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};

const createTokenForTest = () =>
    `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
        JSON.stringify({ name: 'S. A. Ksbehandler', email: 'dev@nav.no', NAVident: 'dev-ident' })
    ).toString('base64')}.bogussignature`;

const refreshAccessToken = async (azureClient: Client, session: SpeilSession): Promise<boolean> => {
    if (!session.refreshToken) return false;
    return await azureClient
        .refresh(session.refreshToken)
        .then((tokenSet: TokenSet) => retrieveTokens(tokenSet, 'access_token', 'refresh_token'))
        .then(([accessToken, refreshToken]) => {
            logger.info(`Refresher access token for ${session.user}`);
            session.speilToken = accessToken;
            session.refreshToken = refreshToken;
            return true;
        })
        .catch((errorMessage) => {
            logger.error(`Feilet refresh av access token for ${session.user}: ${errorMessage}`);
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
