import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { behandlingerFor } from '../io/http';
import { useSessionStorage } from '../hooks/useSessionStorage';

export const BehandlingerContext = createContext();

export const withBehandlingContext = Component => {
    return props => {
        const behandlingerCtx = useContext(BehandlingerContext);
        const behandlinger = behandlingerCtx.state?.behandlinger ?? [];

        return (
            <Component
                behandlinger={behandlinger}
                behandling={behandlingerCtx.valgtBehandling}
                setValgtBehandling={behandlingerCtx.setValgtBehandling}
                fnr={behandlingerCtx.fnr}
                {...props}
            />
        );
    };
};
export const BehandlingerProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [behandlinger, setBehandlinger] = useSessionStorage('behandlinger', []);
    const [fnr, setFnr] = useState(undefined);
    const [valgtBehandling, setValgtBehandling] = useState(undefined);

    const velgBehandling = behandling => {
        const valgtBehandling = behandlinger.find(
            b => b.behandlingsId === behandling.behandlingsId
        );
        setValgtBehandling(valgtBehandling);
    };

    const fetchBehandlinger = value => {
        return behandlingerFor(value)
            .then(response => {
                const { behandlinger } = response.data;
                setFnr(response.data.fnr);
                setBehandlinger(behandlinger);
                setValgtBehandling(behandlinger?.length !== 1 ? undefined : behandlinger[0]);
                return { behandlinger };
            })
            .catch(err => {
                const message =
                    err.statusCode === 401
                        ? 'Du må logge inn på nytt'
                        : err.statusCode === 404
                        ? `Fant ingen behandlinger for ${value}`
                        : 'Kunne ikke utføre søket. Prøv igjen senere.';
                setError({ ...err, message });
            });
    };

    return (
        <BehandlingerContext.Provider
            value={{
                state: { behandlinger },
                setBehandlinger: setBehandlinger,
                setValgtBehandling: velgBehandling,
                valgtBehandling,
                fetchBehandlinger,
                fnr,
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
