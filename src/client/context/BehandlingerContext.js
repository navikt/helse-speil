import React, { createContext, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import VelgBehandlingModal from '../components/MainContentWrapper/VelgBehandlingModal';
import { behandlingerFor, behandlingerIPeriode, getPerson } from '../io/http';
import { useSessionStorage } from '../hooks/useSessionStorage';

export const BehandlingerContext = createContext();

const appendPersoninfo = behandling => {
    return getPerson(behandling.originalSøknad.aktorId)
        .then(response => ({
            ...behandling,
            personinfo: {
                navn: response.data?.navn,
                kjønn: response.data?.kjønn,
                fnr: response.data?.fnr
            }
        }))
        .catch(err => {
            console.error('Feil ved henting av person.', err);
            return behandling;
        });
};

export const BehandlingerProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [behandlinger, setBehandlinger] = useSessionStorage('behandlinger', []);
    const [valgtBehandling, setValgtBehandling] = useSessionStorage('valgtBehandling');
    const [lastBehandlingId, setLastBehandlingId, didFetchLastBehandling] = useSessionStorage(
        'lastBehandlingId'
    );
    const [behandlingsoversikt, setBehandlingsoversikt] = useState([]);
    const [userMustSelectBehandling, setUserMustSelectBehandling] = useState(false);

    useEffect(() => {
        fetchBehandlingsoversikt();
    }, []);

    useEffect(() => {
        if (behandlinger?.length === 1) {
            setValgtBehandling(behandlinger[0]);
        }
    }, [behandlinger]);

    useEffect(() => {
        if (valgtBehandling) {
            setUserMustSelectBehandling(false);
            setLastBehandlingId(valgtBehandling.behandlingsId);
        }
    }, [valgtBehandling]);

    useEffect(() => {
        if (!valgtBehandling && lastBehandlingId && didFetchLastBehandling) {
            velgBehandling({ behandlingsId: lastBehandlingId });
        }
    }, [valgtBehandling, lastBehandlingId, didFetchLastBehandling]);

    const velgBehandlingFraOversikt = ({ behandlingsId, originalSøknad }) => {
        const cachedBehandling = behandlinger.find(b => b.behandlingsId === behandlingsId);
        if (cachedBehandling) {
            setValgtBehandling(cachedBehandling);
            return Promise.resolve();
        }

        return fetchBehandlinger(originalSøknad.aktorId).then(behandlinger =>
            setValgtBehandling(behandlinger.find(b => b.behandlingsId === behandlingsId))
        );
    };

    const velgBehandling = ({ behandlingsId }) => {
        const behandling = behandlinger.find(b => b.behandlingsId === behandlingsId);
        setValgtBehandling(behandling);
    };

    const sort = behandlinger =>
        behandlinger.sort((a, b) => a.vurderingstidspunkt.localeCompare(b.vurderingstidspunkt));

    const fetchBehandlingsoversikt = async () => {
        setValgtBehandling(undefined);
        const oversikt = await fetchBehandlingsoversiktSinceYesterday();
        const oversiktWithPersoninfo = await Promise.all(
            oversikt.map(behandling => appendPersoninfo(behandling))
        );
        if (oversiktWithPersoninfo.find(behandling => behandling.personinfo === undefined)) {
            setError({ message: 'Kunne ikke hente navn for en eller flere saker. Viser aktørId' });
        }
        setBehandlingsoversikt(oversiktWithPersoninfo);
    };

    const fetchBehandlingsoversiktSinceYesterday = () => {
        const yesterday = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');
        return behandlingerIPeriode(yesterday, today)
            .then(response => response.data.behandlinger)
            .catch(err => {
                setError({
                    ...err,
                    message:
                        err.statusCode === 401
                            ? 'Du må logge inn på nytt'
                            : err.statusCode === 404
                            ? 'Fant ingen behandlinger mellom i går og i dag.'
                            : 'Kunne ikke hente behandlinger. Prøv igjen senere.'
                });
                return [];
            });
    };

    const fetchBehandlinger = value => {
        return behandlingerFor(value)
            .then(response => {
                const { behandlinger } = response.data;
                setBehandlinger(behandlinger);
                return behandlinger;
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
                behandlinger,
                velgBehandling,
                velgBehandlingFraOversikt,
                behandlingsoversikt,
                valgtBehandling,
                fetchBehandlinger,
                setUserMustSelectBehandling
            }}
        >
            {children}
            {error && (
                <ErrorModal
                    errorMessage={error.message}
                    onClose={error.statusCode !== 401 ? () => setError(undefined) : undefined}
                />
            )}
            {userMustSelectBehandling && (
                <VelgBehandlingModal
                    onRequestClose={() => setUserMustSelectBehandling(false)}
                    behandlinger={behandlinger}
                    onSelectItem={behandling => velgBehandling(behandling)}
                />
            )}
        </BehandlingerContext.Provider>
    );
};

BehandlingerProvider.propTypes = {
    children: PropTypes.node.isRequired
};
