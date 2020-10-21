import request from 'request-promise-native';
import { OidcConfig, OnBehalfOf } from '../types';

export interface DummyClient {
    postRequest: (body: any, speilToken: string) => Promise<Response>;
}

export default (oidcConfig: OidcConfig, onBehalfOf: OnBehalfOf): DummyClient => ({
    postRequest: async (body: any, speilToken: string): Promise<Response> => {
        const onBehalfOfToken = await onBehalfOf.hentFor(oidcConfig.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/dummytildeling/1234`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options);
    },
});
