import React, { createContext, useEffect, useState } from 'react';
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
    const [personTilBehandling, setPersonTilBehandling] = useSessionStorage('person', {});
    const [behandlingsoversikt, setBehandlingsoversikt] = useState([]);
    const [isFetchingBehandlingsoversikt, setIsFetchingBehandlingsoversikt] = useState(false);
    const [isFetchingPersoninfo, setIsFetchingPersoninfo] = useState(false);

    useEffect(() => {
        fetchBehandlingsoversikt();
    }, []);

    useEffect(() => {
        if (personTilBehandling !== undefined) {
            setPersonTilBehandling(personTilBehandling);
        }
    }, [personTilBehandling]);

    const velgBehandlingFraOversikt = ({ aktørId }) => {
        return hentPerson(aktørId);
    };

    const fetchBehandlingsoversikt = async () => {
        setPersonTilBehandling(undefined);
        const oversikt = await fetchBehandlingsoversiktSinceYesterday();
        setBehandlingsoversikt(oversikt);
        setIsFetchingPersoninfo(true);
        const oversiktWithPersoninfo = await Promise.all(
            oversikt.map(behandling => appendPersoninfo(behandling))
        ).finally(() => setIsFetchingPersoninfo(false));
        if (oversiktWithPersoninfo.find(behandling => behandling.personinfo === undefined)) {
            setError({ message: 'Kunne ikke hente navn for en eller flere saker. Viser aktørId' });
        }
        setBehandlingsoversikt(oversiktWithPersoninfo);
    };

    const fetchBehandlingsoversiktSinceYesterday = () => {
        setIsFetchingBehandlingsoversikt(true);
        return behandlingerIPeriode()
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
            })
            .finally(() => setIsFetchingBehandlingsoversikt(false));
    };

    const hentPerson = value => {
        return hentPersonFraBackend(value)
            .then(response => {
                const { person } = response.data;
                setPersonTilBehandling(person);
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
                personTilBehandling,
                hentPerson,
                isFetchingBehandlingsoversikt,
                isFetchingPersoninfo
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
