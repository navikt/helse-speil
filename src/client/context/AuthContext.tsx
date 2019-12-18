import React, { createContext, ReactChild, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { extractValues, Keys } from '../utils/cookie';

if (process.env.NODE_ENV === 'development') {
    document.cookie = `speil=dev-cookie.${btoa(
        JSON.stringify({
            name: 'Lokal utvikler',
            NAVident: 'dev-ident',
            email: 'dev@nav.no'
        })
    )}.ignored-part`;
}

interface AuthInfo {
    name: string;
    isLoggedIn: boolean;
    email?: string;
    ident?: string;
}

interface AuthContextType {
    authInfo: AuthInfo;
    setUserLoggedOut?: () => void;
}

interface ProviderProps {
    children: ReactChild;
}

const notLoggedInUser = {
    name: '',
    ident: undefined,
    email: undefined,
    isLoggedIn: false
};

export const AuthContext = createContext<AuthContextType>({ authInfo: notLoggedInUser });

export const AuthProvider = ({ children }: ProviderProps) => {
    const [authInfo, setAuthInfo] = useState(notLoggedInUser);
    const [name, ident, email] = extractValues([Keys.NAME, Keys.IDENT, Keys.EMAIL]);

    if (name && name !== authInfo.name) {
        setAuthInfo({
            name,
            ident,
            email,
            isLoggedIn: true
        });
    }

    const setUserLoggedOut = () => {
        setAuthInfo({ ...notLoggedInUser });
    };

    return (
        <AuthContext.Provider
            value={{
                authInfo,
                setUserLoggedOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
