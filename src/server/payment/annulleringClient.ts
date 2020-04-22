import request from 'request-promise-native';
import { OnBehalfOf, AppConfig } from '../types';

export interface AnnulleringClient {
    annuller: (body: AnnulleringBody, accessToken?: string) => Promise<Response>;
}

interface AnnulleringBody {
    aktørId?: string;
    saksbehandler: string;
    utbetalingsreferanse?: string;
    fødselsnummer: string;
}

export default (config: AppConfig, onBehalfOf: OnBehalfOf) => ({
    annuller: async (body: AnnulleringBody, speilToken: string) => {
        const onBehalfOfToken = await onBehalfOf.hentFor(config.oidc.clientIDSpesialist, speilToken);
        const options = {
            uri: `${config.nav.spennUrl}/api/v1/opphor`,
            headers: { Authorization: `Bearer ${onBehalfOfToken}` },
            body,
            json: true
        };

        return request.post(options);
    }
});
