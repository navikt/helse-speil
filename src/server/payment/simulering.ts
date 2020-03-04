import request from 'request-promise-native';
import { NavConfig } from '../types';
import { Utbetalingsvedtak } from '../../types';
import { Response } from 'express';

export interface Simulering {
    simuler: (vedtak: Utbetalingsvedtak, accessToken?: string) => Promise<Response>;
}

let config: NavConfig;

const setup = (_config: NavConfig): Simulering => {
    config = _config;
    return { simuler };
};

const simuler = async (vedtak: Utbetalingsvedtak, accessToken: string) => {
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
