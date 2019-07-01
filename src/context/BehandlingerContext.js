import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { behandlingerFor } from '../io/http';

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
    const [behandlinger, setBehandlinger] = useState([]);

    const fetchBehandlinger = value => {
        behandlingerFor(value)
            .then(response => {
                setBehandlinger({ behandlinger: response });
            })
            .catch(() => {
            });
    };

    return (
        <BehandlingerContext.Provider
            value={{
                state: behandlinger,
                setBehandlinger: setBehandlinger,
                fetchBehandlinger
            }}
        >
            {children}
        </BehandlingerContext.Provider>
    );
};

BehandlingerProvider.propTypes = {
    children: PropTypes.node.isRequired
};
