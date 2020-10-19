import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { extractValues, Keys } from '../utils/cookie';
import { useEffect } from 'react';
import fetchIntercept from 'fetch-intercept';

interface AuthInfo {
    name: string;
    email?: string;
    ident?: string;
    isLoggedIn?: boolean;
}

export const authState = atom<AuthInfo>({
    key: 'auth',
    default: {
        name: '',
        ident: undefined,
        email: undefined,
        isLoggedIn: undefined,
    },
});

export const useEmail = () => useRecoilValue(authState).email;

export const useAuthentication = () => {
    const [authInfo, setAuthInfo] = useRecoilState(authState);
    const resetAuthInfo = useResetRecoilState(authState);
    const [name, ident, email] = extractValues([Keys.NAME, Keys.IDENT, Keys.EMAIL]);

    useEffect(() => {
        if (name && name !== authInfo.name) {
            setAuthInfo({
                name,
                ident,
                email,
                isLoggedIn: true,
            });
        }
    }, [name, authInfo]);

    useEffect(() => {
        fetchIntercept.register({
            response: (res) => {
                if (res.status === 401) {
                    resetAuthInfo();
                }
                return res;
            },
        });
    }, []);
};
