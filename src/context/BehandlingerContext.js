import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { behandlingerFor } from '../io/http';
import { useSessionStorage } from '../hooks/useSessionStorage';

export const BehandlingerContext = createContext();

export const withBehandlingContext = Component => {
    return props => {
        const behandlingerCtx = useContext(BehandlingerContext);
        const behandling =
            behandlingerCtx.state &&
            behandlingerCtx.state.behandlinger &&
            behandlingerCtx.state.behandlinger[0];

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
        behandlingerFor(value)
            .then(response => {
                if (response.status === 200) {
                    setBehandlinger({ behandlinger: response.data });
                } else if (response.status === 401) {
                    setError('Du må logge inn på nytt.');
                } else {
                    setError(`Fant ingen behandlinger for '${value}'`);
                }
            })
            .catch(err => {
                console.log(err); // eslint-disable-line no-console
                setError('Kunne ikke utføre søket');
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
