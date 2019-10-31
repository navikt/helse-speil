import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchPerson } from '../io/http';
import { useSessionStorage } from '../hooks/useSessionStorage';

export const PersonContext = createContext();

export const PersonProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [personTilBehandling, setPersonTilBehandling] = useSessionStorage('person');

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
        <PersonContext.Provider
            value={{
                personTilBehandling,
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
        </PersonContext.Provider>
    );
};

PersonProvider.propTypes = {
    children: PropTypes.node.isRequired
};
