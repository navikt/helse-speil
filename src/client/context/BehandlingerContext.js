import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchPerson, fetchPersonoversikt, getPerson } from '../io/http';
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
    const [personTilBehandling, setPersonTilBehandling] = useSessionStorage('person');
    const [personoversikt, setPersonoversikt] = useState([]);
    const [isFetchingPersonoversikt, setIsFetchingPersonoversikt] = useState(false);
    const [isFetchingPersoninfo, setIsFetchingPersoninfo] = useState(false);

    const velgPersonFraOversikt = ({ aktørId }) => {
        return hentPerson(aktørId);
    };

    const hentPersonoversikt = async () => {
        setPersonTilBehandling(undefined);
        const oversikt = await hentPersoner();
        setPersonoversikt(oversikt);
        setIsFetchingPersoninfo(true);
        const oversiktWithPersoninfo = await Promise.all(
            oversikt.map(behandling => appendPersoninfo(behandling))
        ).finally(() => setIsFetchingPersoninfo(false));
        if (oversiktWithPersoninfo.find(behandling => behandling.personinfo === undefined)) {
            setError({ message: 'Kunne ikke hente navn for en eller flere saker. Viser aktørId' });
        }
        setPersonoversikt(oversiktWithPersoninfo);
    };

    const hentPersoner = () => {
        setIsFetchingPersonoversikt(true);
        return fetchPersonoversikt()
            .then(response => response.data.personer)
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
            .finally(() => setIsFetchingPersonoversikt(false));
    };

    const hentPerson = value => {
        return fetchPerson(value)
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
                        ? `Fant ikke data for ${value}`
                        : 'Kunne ikke utføre søket. Prøv igjen senere.';
                setError({ ...err, message });
            });
    };

    return (
        <BehandlingerContext.Provider
            value={{
                velgPersonFraOversikt,
                personoversikt,
                hentPersonoversikt,
                personTilBehandling,
                hentPerson,
                isFetchingPersonoversikt,
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
