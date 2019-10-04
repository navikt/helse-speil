import React, { createContext, useContext, useEffect, useState } from 'react';
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
                velgBehandling={behandlingerCtx.velgBehandling}
                userMustSelectBehandling={behandlingerCtx.userMustSelectBehandling}
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
    const [lastSelectedBehandling, setLastSelectedBehandling] = useSessionStorage(
        'last-selected-behandling-id',
        undefined
    );
    const [userMustSelectBehandling, setUserMustSelectBehandling] = useState(false);

    const velgBehandling = async behandling => {
        const valgtBehandling = behandlinger.find(
            b => b.behandlingsId === behandling?.behandlingsId
        );
        if (valgtBehandling && !valgtBehandling.sykepengeberegning) {
            await fetchBehandlinger(
                valgtBehandling.originalSøknad.aktorId,
                valgtBehandling.behandlingsId
            );
        } else {
            setValgtBehandling(valgtBehandling);
        }
        setLastSelectedBehandling(valgtBehandling?.behandlingsId);
    };

    useEffect(() => {
        if (lastSelectedBehandling !== undefined) {
            velgBehandling({ behandlingsId: lastSelectedBehandling });
        }
    }, [lastSelectedBehandling]);

    const fetchBehandlingerMedPersoninfo = async () => {
        setValgtBehandling(undefined);
        const alleBehandlinger = await fetchAlleBehandlinger();
        setBehandlinger(alleBehandlinger);
        if (alleBehandlinger !== undefined) {
            const behandlingerMedPersoninfo = await hentNavnForBehandlinger(alleBehandlinger);
            if (behandlingerMedPersoninfo.find(behandling => behandling.personinfo === undefined)) {
                setError({
                    message: 'Kunne ikke hente navn for en eller flere saker. Viser aktørId'
                });
            }
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
                return behandling;
            });
    };

    const fetchBehandlinger = (value, behandlingsId) => {
        setUserMustSelectBehandling(false);
        return behandlingerFor(value)
            .then(response => {
                const { behandlinger } = response.data;
                setFnr(response.data.fnr);
                setBehandlinger(behandlinger);
                if (!behandlingsId) {
                    if (behandlinger?.length === 1) {
                        setLastSelectedBehandling(behandlinger[0].behandlingsId);
                    } else if (behandlinger.length > 1) {
                        setLastSelectedBehandling(null);
                        setUserMustSelectBehandling(true);
                    }

                    setValgtBehandling(behandlinger?.length !== 1 ? undefined : behandlinger[0]);
                } else {
                    setValgtBehandling(
                        behandlinger.find(behandling => behandling.behandlingsId === behandlingsId)
                    );
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
                setBehandlinger,
                velgBehandling,
                valgtBehandling,
                fetchBehandlinger,
                userMustSelectBehandling,
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
