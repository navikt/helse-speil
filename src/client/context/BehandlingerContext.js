import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { behandlingerFor, behandlingerIPeriode, getPerson } from '../io/http';
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
                fnr={behandlingerCtx.fnr}
                fetchAlleBehandlinger={behandlingerCtx.fetchBehandlingerMedPersoninfo}
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

    const velgBehandling = (behandling, history) => {
        const valgtBehandling = behandlinger.find(
            b => b.behandlingsId === behandling?.behandlingsId
        );
        if (valgtBehandling && !valgtBehandling.avklarteVerdier) {
            fetchBehandlinger(valgtBehandling.aktorId, valgtBehandling.behandlingsId, history);
        } else {
            setValgtBehandling(valgtBehandling);
            if (history) {
                history.push('/sykdomsvilkår');
            }
        }
    };

    const fetchBehandlingerMedPersoninfo = async () => {
        setValgtBehandling(undefined);
        const alleBehandlinger = await fetchAlleBehandlinger();
        setBehandlinger(alleBehandlinger);
        if (alleBehandlinger !== undefined) {
            const behandlingerMedPersoninfo = await hentNavnForBehandlinger(alleBehandlinger);
            setBehandlinger(behandlingerMedPersoninfo);
        }
    };

    const fetchAlleBehandlinger = () => {
        const fom = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
        const tom = moment().format('YYYY-MM-DD');
        return behandlingerIPeriode(fom, tom)
            .then(response => {
                const newData = response.data;
                return newData.behandlinger;
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
                console.error('Feil ved henting av behandlinger. ', err);
                return [];
            });
    };

    const hentNavnForBehandlinger = async alleBehandlinger => {
        return await Promise.all(alleBehandlinger.map(behandling => fetchPerson(behandling)));
    };

    const fetchPerson = behandling => {
        return getPerson(behandling.originalSøknad.aktorId)
            .then(response => {
                return {
                    ...behandling,
                    personinfo: {
                        navn: response.data.navn,
                        kjønn: response.data.kjønn
                    }
                };
            })
            .catch(err => {
                console.error('Feil ved henting av person.', err);
                setError({
                    ...err,
                    message: 'Kunne ikke hente navn for en eller flere saker. Viser aktørId'
                });
                return behandling;
            });
    };

    const fetchBehandlinger = (value, behandlingsId, history) => {
        return behandlingerFor(value)
            .then(response => {
                const { behandlinger } = response.data;
                setFnr(response.data.fnr);
                setBehandlinger(behandlinger);
                if (!behandlingsId) {
                    setValgtBehandling(behandlinger?.length !== 1 ? undefined : behandlinger[0]);
                } else {
                    setValgtBehandling(
                        behandlinger.find(behandling => behandling.behandlingsId === behandlingsId)
                    );
                }
                if (history) {
                    history.push('/sykdomsvilkår');
                }
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
                fetchBehandlingerMedPersoninfo,
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
