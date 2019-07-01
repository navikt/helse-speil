import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const BehandlingerContext = createContext();

export const withBehandlingContext = Component => {
    return props => {
        const behandlingerCtx = useContext(BehandlingerContext);
        const behandling =
            behandlingerCtx.state &&
            behandlingerCtx.state.behandlinger &&
            behandlingerCtx.state.behandlinger[0];

        if (!behandling) {
            return '';
        }

        return <Component behandling={behandling} {...props} />;
    };
};

export const BehandlingerProvider = ({ children }) => {
    const [behandlinger, setBehandlinger] = useState([]);

    return (
        <BehandlingerContext.Provider
            value={{
                state: behandlinger,
                setBehandlinger: setBehandlinger
            }}
        >
            {children}
        </BehandlingerContext.Provider>
    );
};

BehandlingerProvider.propTypes = {
    children: PropTypes.node.isRequired
};
