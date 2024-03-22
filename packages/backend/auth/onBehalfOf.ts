import { getToken, requestAzureOboToken } from '@navikt/oasis';

import { Instrumentation } from '../instrumentation';
import logger from '../logging';
import { OnBehalfOf } from '../types';

export default (instrumentation: Instrumentation): OnBehalfOf => {
    const counter = instrumentation.onBehalfOfCounter();

    return {
        hentFor: async (targetClientId: string, accessToken: string) => {
            counter.inc(targetClientId);

            const token = getToken(accessToken);
            const oboToken = await requestAzureOboToken(token, targetClientId);

            if (!oboToken.ok) {
                logger.error(`tokenSet error ${oboToken.error.message} ved henting av token for ${targetClientId}`);
                throw new Error(`Feil ved henting av token for ${targetClientId}`);
            }

            return oboToken.token;
        },
    };
};
