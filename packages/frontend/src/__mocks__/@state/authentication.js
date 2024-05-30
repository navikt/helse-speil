// eslint-disable-next-line @typescript-eslint/no-var-requires
const { nanoid } = require('nanoid');

module.exports = {
    useInnloggetSaksbehandler: jest.fn().mockReturnValue({
        oid: nanoid(),
        epost: 'navn.navnesen@nav.no',
        navn: 'Navnesen, Navn',
        ident: 'N123456',
    }),
    useAuthentication: jest.fn(),
};
