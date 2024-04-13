import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import logger from '../logging';
import { OidcConfig, OnBehalfOf, SpeilSession } from '../types';

const modiaBaseUrl = config.server.modiaBaseUrl;

export interface ModiaClient {
    postModiaContext: (speilToken: string, session: SpeilSession, data: string) => Promise<undefined>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): ModiaClient => ({
    postModiaContext: async (speilToken: string, session: SpeilSession, data: string): Promise<undefined> => {
        const callId = uuidv4();
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.modiaApiScope, session, speilToken);
        const options = {
            method: 'post',
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
                'X-Request-Id': callId,
                'Content-Type': 'application/json',
                'Nav-Consumer-Id': 'speil',
            },
            body: JSON.stringify(data),
        };

        const maskertToken = onBehalfOfToken.substring(0, 6);
        logger.debug(`Kaller ${modiaBaseUrl} med X-Request-Id: ${callId} og token: ${maskertToken}...`);
        const start = Date.now();

        const response = await fetch(`${modiaBaseUrl}/api/context`, options);
        if (!response.ok) throw Error(`Fetch feilet, status: ${response.status}`);

        const tidBrukt = Date.now() - start;
        logger.debug(
            `Satte person i context i Modia (${modiaBaseUrl}) med X-Request-Id: ${callId} - ferdig etter ${tidBrukt} ms`,
        );
        return;
    },
});
