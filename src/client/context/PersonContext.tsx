import React, { createContext, useState, useEffect, ReactChild } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import personMapper from './mapper';
import { fetchPerson, getPersoninfo } from '../io/http';
import { Person } from './types';

interface PersonContextType {
    personTilBehandling?: Person;
    hentPerson: (id: string) => Promise<Person | undefined>;
    innsyn: boolean; // TODO: Rename denne til noe som gir mer mening.
}

interface PersonContextError {
    message: string;
    statusCode: number;
}

interface ProviderProps {
    children: ReactChild;
}

export const PersonContext = createContext<PersonContextType>({
    innsyn: false,
    hentPerson: (id: string) => Promise.resolve(undefined)
});

export const PersonProvider = ({ children }: ProviderProps) => {
    const [error, setError] = useState<PersonContextError | undefined>();
    const [aktørIdFromUrl, setAktørIdFromUrl] = useState<string | undefined>();
    const [personTilBehandling, setPersonTilBehandling] = useState<Person | undefined>();
    const [innsyn, setInnsyn] = useState(false);

    useEffect(() => {
        const aktørId = /\d{12,15}$/.exec(window.location.pathname);
        if (!aktørIdFromUrl && aktørId) {
            setAktørIdFromUrl(aktørId[0]);
        }
    }, []);

    useEffect(() => {
        if (aktørIdFromUrl && !personTilBehandling) {
            hentPerson(aktørIdFromUrl);
        }
    }, [aktørIdFromUrl, personTilBehandling]);

    const hentPerson = (value: string) => {
        const innsyn = value.length === 26;
        setInnsyn(innsyn);
        return fetchPerson(value, innsyn)
            .then(async response => {
                const aktørId = response.data.person.aktørId;
                const personinfo = await getPersoninfo(aktørId).then(response => ({
                    ...response.data
                }));
                const person = { ...response.data.person, personinfo };
                setPersonTilBehandling(personMapper.map(person, personinfo));
                return person;
            })
            .catch(err => {
                if (!err.statusCode) console.error(err);
                const message =
                    err.statusCode === 401
                        ? 'Du må logge inn på nytt'
                        : err.statusCode === 404
                        ? `Fant ikke data for ${value}`
                        : 'Kunne ikke utføre søket. Prøv igjen senere.';
                setError({ ...err, message });
                return Promise.reject();
            });
    };

    return (
        <PersonContext.Provider
            value={{
                personTilBehandling,
                hentPerson,
                innsyn
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
