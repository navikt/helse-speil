import request from 'request-promise-native';
import auth from '../auth/authsupport';
import { NavConfig } from '../types';
import { Utbetalingsvedtak } from '../../types';
import { Response } from 'express';

export interface Simulering {
    simuler: (vedtak: Utbetalingsvedtak, accessToken?: string) => Promise<Response>;
}

let config: NavConfig;

const setup = (_config: NavConfig) => {
    config = _config;
    return { simuler };
};

const simuler = async (vedtak: Utbetalingsvedtak, accessToken: string) => {
    vedtak.saksbehandler = auth.valueFromClaim('name', accessToken);

    const options = {
        uri: `${config.spennUrl}/api/v1/simulering`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: vedtak,
        json: true
    };

    return request.post(options);
};

export default { setup };
