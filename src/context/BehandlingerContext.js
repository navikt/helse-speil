import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { behandlingerFor } from '../io/http';
import { useSessionStorage } from '../hooks/useSessionStorage';

export const BehandlingerContext = createContext();

export const withBehandlingContext = Component => {
    return props => {
        const behandlingerCtx = useContext(BehandlingerContext);
        const behandling = behandlingerCtx.state?.behandlinger?.[0];

        return <Component behandling={behandling} {...props} />;
    };
};

export const BehandlingerProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [behandlinger, setBehandlinger] = useSessionStorage(
        'behandlinger',
        []
    );

    const fetchBehandlinger = value => {
        return behandlingerFor(value)
            .then(response => {
                const newData = { behandlinger: response.data };
                setBehandlinger(newData);
                return newData;
            })
            .catch(err => {
                if (err.statusCode === 401) {
                    setError({ ...err, message: 'Du må logge inn på nytt.' });
                } else if (err.statusCode === 404) {
                    setError({
                        ...err,
                        message: `Fant ingen behandlinger for ${value}.`
                    });
                } else {
                    setError({
                        ...err,
                        message: 'Kunne ikke utføre søket. Prøv igjen senere.'
                    });
                }
            });
    };

    return (
        <BehandlingerContext.Provider
            value={{
                state: behandlinger,
                setBehandlinger: setBehandlinger,
                fetchBehandlinger,
                error,
                clearError: () => setError(undefined)
            }}
        >
            {children}
        </BehandlingerContext.Provider>
    );
};

BehandlingerProvider.propTypes = {
    children: PropTypes.node.isRequired
};
