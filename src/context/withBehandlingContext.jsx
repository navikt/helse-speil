import React, { useContext } from 'react';
import BehandlingerContext from '../../context/BehandlingerContext';

export const withBehandlingContext = (Component) => {
    return (props) => {
        const behandlingerCtx = useContext(BehandlingerContext);

        if (
            !behandlingerCtx.state
            || !behandlingerCtx.state.behandlinger
            || !behandlingerCtx.state.behandlinger[0]
        ) {
            return '';
        }

        const behandling = behandlingerCtx.state.behandlinger[0];

        return <Component behandling={behandling} {...props} />
    };
};
