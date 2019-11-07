import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchPersonoversikt, getPersoninfo } from '../io/http';
import { PersonContext } from './PersonContext';

export const PersonoversiktContext = createContext();

const appendPersoninfo = behov => {
    return getPersoninfo(behov.aktørId)
        .then(response => ({
            ...behov,
            personinfo: {
                navn: response.data?.navn,
                kjønn: response.data?.kjønn,
                fnr: response.data?.fnr
            }
        }))
        .catch(err => {
            console.error('Feil ved henting av person.', err);
            return behov;
        });
};

export const PersonoversiktProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [personoversikt, setPersonoversikt] = useState([]);
    const [isFetchingPersonoversikt, setIsFetchingPersonoversikt] = useState(false);
    const [isFetchingPersoninfo, setIsFetchingPersoninfo] = useState(false);
    const { hentPerson } = useContext(PersonContext);

    const velgPersonFraOversikt = ({ aktørId }) => {
        return hentPerson(aktørId);
    };

    const hentPersonoversikt = async () => {
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
            .then(response => response.data.behov)
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

    return (
        <PersonoversiktContext.Provider
            value={{
                velgPersonFraOversikt,
                personoversikt,
                hentPersonoversikt,
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
        </PersonoversiktContext.Provider>
    );
};

PersonoversiktProvider.propTypes = {
    children: PropTypes.node.isRequired
};
