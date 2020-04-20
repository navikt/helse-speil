import React, { createContext, ReactChild, useState } from 'react';
import { extractValues, Keys } from '../utils/cookie';

interface AuthContextType {
    name: string;
    isLoggedIn: boolean;
    email?: string;
    ident?: string;
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

export const AuthContext = createContext<AuthContextType>({ ...notLoggedInUser });

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
                ...authInfo,
                setUserLoggedOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
