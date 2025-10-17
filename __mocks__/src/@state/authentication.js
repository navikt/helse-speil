import { generateId } from '../../../src/utils/generateId';

module.exports = {
    useInnloggetSaksbehandler: jest.fn().mockReturnValue({
        oid: generateId(),
        epost: 'navn.navnesen@nav.no',
        navn: 'Navnesen, Navn',
        ident: 'N123456',
    }),
    useAuthentication: jest.fn(),
};
