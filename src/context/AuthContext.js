import React, { createContext, useEffect, useState } from 'react';
import { whoami } from '../io/http';
import PropTypes from 'prop-types';
import ErrorModal from '../components/widgets/modal/ErrorModal';

export const AuthContext = createContext({
    name: ''
});

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [authState, setAuthState] = useState({});

    useEffect(() => {
        if (!authState.name) {
            whoami()
                .then(data => {
                    if (data && data.name) {
                        setAuthState({ name: data.name });
                    } else {
                        window.location.assign('/login');
                    }
                })
                .catch(err => {
                    setError(err.toString());
                });
        }
    }, [authState]);

    return (
        <AuthContext.Provider
            value={{
                state: authState,
                setState: setAuthState
            }}
        >
            {children}
            {error && <ErrorModal errorMessage={error} />}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
