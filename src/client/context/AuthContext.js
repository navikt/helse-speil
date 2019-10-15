import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { extractValues, Keys } from '../utils/cookie';

const notLoggedInUser = {
    name: '',
    ident: undefined,
    email: undefined,
    isLoggedIn: false
};

export const AuthContext = createContext(notLoggedInUser);

export const AuthProvider = ({ children }) => {
    const [authInfo, setAuthInfo] = useState({});

    useEffect(() => {
        /* eslint-disable no-undef */
        if (process.env.NODE_ENV === 'development') {
            /* eslint-enable */
            document.cookie = `speil=dev-cookie.${btoa(
                JSON.stringify({
                    name: 'Lokal utvikler',
                    ident: 'dev-ident',
                    email: 'dev@nav.no'
                })
            )}.ignored-part`;
        }
    }, []);

    useEffect(() => {
        const [name, ident, email] = extractValues([Keys.NAME, Keys.IDENT, Keys.EMAIL]);
        if (name && name !== authInfo.name) {
            setAuthInfo({
                name,
                ident,
                email,
                isLoggedIn: true
            });
        }
    });

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
