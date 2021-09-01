import fetchIntercept from 'fetch-intercept';
import { Saksbehandler } from 'internal-types';
import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { extractValues, Keys } from '../utils/cookie';

interface AuthInfo {
    name: string;
    email?: string;
    ident?: string;
    oid?: string;
    isLoggedIn?: boolean;
}

const getDecodedAuthenticationCookie = () => {
    const [name, ident, email, oid] = extractValues([Keys.NAME, Keys.IDENT, Keys.EMAIL, Keys.OID]);
    return { name, ident, email, oid };
};

export const authState = atom<AuthInfo>({
    key: 'auth',
    default: getDecodedAuthenticationCookie(),
});

export const useInnloggetSaksbehandler = (): Saksbehandler => {
    const authInfo = useRecoilValue(authState) as Required<AuthInfo>;

    return {
        oid: authInfo.oid,
        navn: authInfo.name,
        epost: authInfo.email,
    };
};

export const useAuthentication = () => {
    const [authInfo, setAuthInfo] = useRecoilState(authState);
    const resetAuthInfo = useResetRecoilState(authState);
    const { name, ...rest } = getDecodedAuthenticationCookie();

    useEffect(() => {
        if (name && name !== authInfo.name) {
            setAuthInfo({ name, ...rest, isLoggedIn: true });
        }
    }, [name, authInfo]);

    useEffect(() => {
        fetchIntercept.register({
            response: (res) => {
                if (res.status === 401) {
                    localStorage.removeItem('agurkmodus');
                    resetAuthInfo();
                }
                return res;
            },
        });
    }, []);
};
