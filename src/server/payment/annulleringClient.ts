import request from 'request-promise-native';
import { OnBehalfOf, AppConfig } from '../types';

export interface AnnulleringClient {
    annuller: (body: Object, accessToken?: string) => Promise<Response>;
}

export default (config: AppConfig, onBehalfOf: OnBehalfOf) => ({
    annuller: async (body: Object, speilToken: string) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(config.oidc.clientIDSpesialist, speilToken);
        const options = {
            uri: `http://spesialist.default.svc.nais.local/api/annullering`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            body,
            json: true
        };

        return request.post(options);
    }
});
