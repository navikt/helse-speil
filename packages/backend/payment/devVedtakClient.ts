import { sleep } from '../devHelpers';
import { VedtakClient } from './vedtakClient';

const devVedtakClient: VedtakClient = {
    postVedtak: async (): Promise<any> => (Math.random() > 0 ? sleep(420) : Promise.reject('Dev-feil!')),
};

export default devVedtakClient;
