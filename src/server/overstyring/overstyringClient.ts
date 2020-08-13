import request from 'request-promise-native';
import { OverstyringDTO } from '../../client/io/types';
import { OidcConfig, OnBehalfOf } from '../types';

export interface OverstyringClient {
    overstyrDager: (overstyring: OverstyringDTO, speilToken: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): OverstyringClient => ({
    overstyrDager: async (overstyring: OverstyringDTO, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/overstyr/dager`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: overstyring,
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
});
