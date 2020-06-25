import { SparkelClient } from './sparkelClient';
import { UnmappedPersoninfo } from '../../types';

const hentPersoninfo = (aktørId: string, _: string): Promise<UnmappedPersoninfo> => {
    let response: UnmappedPersoninfo;

    switch (aktørId) {
        case '1000000009871':
            response = { fornavn: 'Kong', etternavn: 'Harald', kjønn: 'mann', fdato: '1937-02-21' };
            break;
        case '87654321962123':
            response = { fornavn: 'Dronning', etternavn: 'Sonja', kjønn: 'kvinne', fdato: '1937-07-04' };
            break;
        case '87650000962123':
            response = { fornavn: 'Ingrid', etternavn: 'Alexandra', kjønn: 'kvinne', fdato: '2004-01-21' };
            break;
        case '57650000444423':
            response = { fornavn: 'Märtha', etternavn: 'Louise', kjønn: 'kvinne', fdato: '1975-09-22' };
            break;
        case '1000000000009':
            response = { fornavn: 'Sverre', etternavn: 'Magnus', kjønn: 'mann', fdato: '2005-12-05' };
            break;
        default:
            response = { fornavn: 'Kronprins', etternavn: 'Haakon', kjønn: 'mann', fdato: '1973-07-20' };
            break;
    }
    return Promise.resolve(response);
};

const devSparkelClient: SparkelClient = { hentPersoninfo };

export default devSparkelClient;
