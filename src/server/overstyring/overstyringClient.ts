import request from 'request-promise-native';
import { OverstyringDTO } from '../../client/io/types';

export interface OverstyringClient {
    overstyrDager: (overstyring: OverstyringDTO, onBehalfOfToken: string) => Promise<Response>;
}

export const overstyringClient: OverstyringClient = {
    overstyrDager: async (overstyring, onBehalfOfToken): Promise<Response> => {
        const options = {
            uri: `http://spesialist.tbd.svc.nais.local/api/overstyr/dager`,
            headers: {
                Authorization: `Bearer ${onBehalfOfToken}`,
            },
            body: overstyring,
            resolveWithFullResponse: true,
            json: true,
        };
        return request.post(options).then((res) =>
            Promise.resolve(({
                status: res.statusCode,
                body: res.body,
            } as unknown) as Response)
        );
    },
};
