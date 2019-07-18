import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import extractName from '../utils/cookie';

const notLoggedInUser = {
    name: '',
    isLoggedIn: false
};

export const AuthContext = createContext(notLoggedInUser);

export const AuthProvider = ({ children }) => {
    const [authInfo, setAuthInfo] = useState({});

    useEffect(() => {
        const name = extractName();
        if (name && name !== authInfo.name) {
            setAuthInfo({ name, isLoggedIn: true });
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
