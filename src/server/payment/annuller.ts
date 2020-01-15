import request from 'request-promise-native';
import auth from '../auth/authsupport';
import { NavConfig } from '../types';

export interface Annullering {
    annuller: (body: AnnulleringBody, accessToken?: string) => Promise<Response>;
}

interface AnnulleringBody {
    aktørId?: string;
    accessToken?: string;
    saksbehandler?: string;
    utbetalingsreferanse?: string;
}

let config: NavConfig;

const setup = (_config: NavConfig) => {
    config = _config;
    return { annuller };
};

const annuller = async (body: AnnulleringBody, accessToken: string) => {
    body.saksbehandler = auth.valueFromClaim('NAVident', accessToken);

    const options = {
        uri: `${config.spennUrl}/api/v1/opphor`,
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
        json: true
    };

    return request.post(options);
};

export default { setup };
