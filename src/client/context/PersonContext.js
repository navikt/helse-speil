import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { fetchPerson, getPersoninfo } from '../io/http';
import personMapper from './mapper';

export const PersonContext = createContext({});

export const PersonProvider = ({ children }) => {
    const [error, setError] = useState(undefined);
    const [aktørIdFromUrl, setAktørIdFromUrl] = useState();
    const [personTilBehandling, setPersonTilBehandling] = useState();
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

    const hentPerson = value => {
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
