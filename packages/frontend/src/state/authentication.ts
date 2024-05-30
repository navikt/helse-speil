import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { Keys, extractValues } from '@utils/cookie';

interface AuthInfo {
    name: string;
    email?: string;
    ident?: string;
    oid?: string;
    isLoggedIn?: boolean;
}

export const authState = atom<AuthInfo>({
    key: 'auth',
    default: {
        name: '',
        ident: undefined,
        email: undefined,
        oid: undefined,
        isLoggedIn: undefined,
    },
});

export const useAuthentication = (): AuthInfo => {
    return useRecoilValue(authState);
};

export const useInnloggetSaksbehandler = (): Saksbehandler => {
    const authInfo = useRecoilValue(authState) as Required<AuthInfo>;

    return {
        oid: authInfo.oid,
        navn: authInfo.name,
        epost: authInfo.email,
        ident: authInfo.ident,
        isLoggedIn: authInfo.isLoggedIn ?? false,
    };
};

export const useUpdateAuthentication = () => {
    const [authInfo, setAuthInfo] = useRecoilState(authState);
    const resetAuthInfo = useResetRecoilState(authState);
    const [name, ident, email, oid] = extractValues([Keys.NAME, Keys.IDENT, Keys.EMAIL, Keys.OID]);

    useEffect(() => {
        if (name && name !== authInfo.name) {
            setAuthInfo({
                name,
                ident,
                email,
                oid,
                isLoggedIn: true,
            });
        }
    }, [name, authInfo]);

    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async function (input, init) {
            const response = await originalFetch(input as string | Request | URL, init);
            if (response.status === 401) {
                localStorage.removeItem('agurkmodus');
                resetAuthInfo();
            }

            return response;
        };
    }, []);
};
