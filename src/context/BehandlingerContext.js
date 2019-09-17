import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { behandlingerFor, behandlingerIPeriode } from '../io/http';
import { useSessionStorage } from '../hooks/useSessionStorage';
import moment from 'moment';

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
                fetchAlleBehandlinger={behandlingerCtx.fetchAlleBehandlinger}
                {...props}
            />
        );
    };
};
export const BehandlingerProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [behandlinger, setBehandlinger] = useSessionStorage('behandlinger', []);
    const [valgtBehandling, setValgtBehandling] = useState(undefined);

    const velgBehandling = behandling => {
        const valgtBehandling = behandlinger.find(
            b => b.behandlingsId === behandling.behandlingsId
        );

        setValgtBehandling(valgtBehandling);
    };

    const fetchAlleBehandlinger = () => {
        const fom = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
        const tom = moment().format('YYYY-MM-DD');
        return behandlingerIPeriode(fom, tom)
            .then(response => {
                const newData = { behandlinger: response.data };
                setBehandlinger(newData.behandlinger);
                setValgtBehandling(undefined);
            })
            .catch(err => {
                if (err.statusCode === 401) {
                    setError({ ...err, message: 'Du må logge inn på nytt.' });
                } else if (err.statusCode === 404) {
                    setError({
                        ...err,
                        message: `Fant ingen behandlinger mellom i går og i dag.`
                    });
                } else {
                    setError({
                        ...err,
                        message: 'Kunne ikke hente behandlinger. Prøv igjen senere.'
                    });
                }
            });
    };

    const fetchBehandlinger = value => {
        return behandlingerFor(value)
            .then(response => {
                const newData = { behandlinger: response.data };
                setBehandlinger(newData.behandlinger);
                if (newData.behandlinger?.length !== 1) {
                    setValgtBehandling(undefined);
                } else {
                    setValgtBehandling(newData.behandlinger[0]);
                }
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
                state: { behandlinger },
                setBehandlinger: setBehandlinger,
                setValgtBehandling: velgBehandling,
                valgtBehandling,
                fetchBehandlinger,
                fetchAlleBehandlinger,
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
