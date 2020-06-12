import request from 'request-promise-native';
import { UnmappedPersoninfo } from '../../types';

export interface SparkelClient {
    hentPersoninfo: (aktørId: string, token: string) => Promise<UnmappedPersoninfo>;
}

export const sparkelClient: SparkelClient = {
    hentPersoninfo: (aktørId: string, token: string) => {
        const options = {
            uri: `http://sparkel.default.svc.nais.local/api/person/${aktørId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            json: true,
        };
        return request.get(options);
    },
};

export default sparkelClient;
