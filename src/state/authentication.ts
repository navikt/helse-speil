import { useBruker } from '@auth/brukerContext';

export type Saksbehandler = {
    oid: string;
    epost: string;
    navn: string;
    ident?: string;
    isLoggedIn?: boolean;
};

export const useInnloggetSaksbehandler = (): Saksbehandler => {
    const authInfo = useBruker();

    return {
        oid: authInfo.oid,
        epost: authInfo.epost,
        navn: authInfo.navn,
        ident: authInfo.ident,
        isLoggedIn: true,
    };
};
