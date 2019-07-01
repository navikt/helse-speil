import React, { useContext } from 'react';
import BehandlingerContext from './BehandlingerContext';

export const withBehandlingContext = Component => {
    return props => {
        const behandlingerCtx = useContext(BehandlingerContext);
        const behandling = behandlingerCtx.state.behandlinger[0];

        return <Component behandling={behandling} {...props} />;
    };
};
