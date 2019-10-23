import React, { createContext, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { hentPersonFraBackend, behandlingerIPeriode, getPerson } from '../io/http';
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
    const [valgtBehandling, setValgtBehandling] = useSessionStorage('person', {});
    const [behandlingsoversikt, setBehandlingsoversikt] = useState([]);

    useEffect(() => {
        fetchBehandlingsoversikt();
    }, []);

    useEffect(() => {
        if (valgtBehandling !== undefined) {
            setValgtBehandling(valgtBehandling);
        }
    }, [valgtBehandling]);

    const velgBehandlingFraOversikt = ({ aktørId }) => {
        return hentPerson(aktørId);
    };

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

    const hentPerson = value => {
        return hentPersonFraBackend(value)
            .then(response => {
                const { person } = response.data;
                setValgtBehandling(person);
                return person;
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
                velgBehandlingFraOversikt,
                behandlingsoversikt,
                valgtBehandling,
                hentPerson
            }}
        >
            {children}
            {error && (
                <ErrorModal
                    errorMessage={error.message}
                    onClose={error.statusCode !== 401 ? () => setError(undefined) : undefined}
                />
            )}
        </BehandlingerContext.Provider>
    );
};

BehandlingerProvider.propTypes = {
    children: PropTypes.node.isRequired
};
