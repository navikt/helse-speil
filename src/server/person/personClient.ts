import request from 'request-promise-native';

import { Instrumentation } from '../instrumentation';
import { OidcConfig, OnBehalfOf } from '../types';

export interface PersonoppdateringOptions {
    fødselsnummer: string;
}

export interface PersonClient {
    oppdaterPersoninfo: (oppdater: PersonoppdateringOptions, speilToken: string) => Promise<Response>;
}

export const personClient = (
    instrumentation: Instrumentation,
    oidcConfig: OidcConfig,
    onBehalfOf: OnBehalfOf
): PersonClient => ({
    oppdaterPersoninfo: async (oppdatering, speilToken): Promise<Response> => {
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/oppdater');

        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/person/oppdater`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            body: oppdatering,
            json: true,
        };

        return request.post(options).then((res) => {
            tidtakning();
            return Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response);
        });
    },
});
