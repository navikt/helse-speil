import { SparkelClient } from './sparkelClient';
import { UnmappedPersoninfo } from '../../types';

const hentPersoninfo = (aktørId: string, _: string): Promise<UnmappedPersoninfo> => {
    let response: UnmappedPersoninfo;

    switch (aktørId) {
        case '1000000009871':
            response = { fornavn: 'Kong', etternavn: 'Harald', kjønn: 'mann', fdato: '2000-02-12' };
            break;
        case '87654321962123':
            response = { fornavn: 'Dronning', etternavn: 'Sonja', kjønn: 'kvinne', fdato: '2000-02-12' };
            break;
        case '87650000962123':
            response = { fornavn: 'Ingrid', etternavn: 'Alexandra', kjønn: 'kvinne', fdato: '2000-02-12' };
            break;
        default:
            response = { fornavn: 'Kronprins', etternavn: 'Haakon', kjønn: 'mann', fdato: '2000-02-12' };
            break;
    }
    return Promise.resolve(response);
};

const devSparkelClient: SparkelClient = { hentPersoninfo };

export default devSparkelClient;
