import { TokenSet } from 'openid-client';

import { Instrumentation } from '../instrumentation';
import logger from '../logging';
import { OidcConfig, OnBehalfOf, SpeilSession } from '../types';
import { sleep } from '../utils';
import authSupport from './authSupport';

export default (config: OidcConfig, instrumentation: Instrumentation): OnBehalfOf => {
    const counter = instrumentation.onBehalfOfCounter();

    const hentToken = async (init: RequestInit): Promise<TokenSet> => {
        const response = await fetch(config.tokenEndpoint, init);
        const data = await response.json();
        if (!data || data.error) throw new Error(data.error);
        return data;
    };

    return {
        hentFor: async (targetClientId: string, session: SpeilSession, accessToken: string) => {
            const oboToken = session.oboTokens?.[targetClientId];
            if (oboToken && authSupport.isValidIn({ seconds: 5, token: oboToken })) {
                logger.info('Bruker cachet obo token i stedet for å hente nytt');
                return oboToken;
            }

            logger.info(`Forsøker å hente nytt obo token for ${targetClientId}`);

            counter.inc(targetClientId);

            const options = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    client_id: config.clientID, // our own
                    client_secret: config.clientSecret,
                    assertion: accessToken,
                    scope: targetClientId, // the app we're reaching out to
                    requested_token_use: 'on_behalf_of',
                }),
            };
            let forsøk = 1;
            let tokenSet: TokenSet | undefined;
            while (!tokenSet) {
                try {
                    tokenSet = await hentToken(options);
                } catch (error) {
                    if (forsøk < 3) {
                        logger.info(`Prøver å hente token på nytt for ${targetClientId}, feil: ${error}`);
                        forsøk++;
                        await sleep(500 * forsøk);
                    } else {
                        logger.error(
                            `Feil etter ${forsøk} forsøk ved henting av token for ${targetClientId}: ${error}, gir opp.`,
                        );
                        throw error;
                    }
                }
            }

            if (forsøk > 1) {
                logger.info(`Brukte ${forsøk} forsøk på å hente token for ${targetClientId}`);
            }

            session.oboTokens[targetClientId] = tokenSet.access_token!;

            return tokenSet.access_token!;
        },
    };
};
