import request from 'request-promise-native';
import { PersonoppdateringDTO } from '../../client/io/types';
import { OidcConfig, OnBehalfOf } from '../types';
import { Instrumentation } from '../instrumentation';

export interface PersonClient {
    oppdaterPersoninfo: (oppdater: PersonoppdateringDTO, speilToken: string) => Promise<Response>;
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
