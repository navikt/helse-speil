import React, { createContext, ReactChild, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { tilPerson } from './mapping/personmapper';
import { fetchPerson, getPersoninfo } from '../io/http';
import { Person, Vedtaksperiode } from './types.internal';
import { useLocation } from 'react-router-dom';

interface PersonContextType {
    hentPerson: (id: string) => Promise<Person | undefined>;
    innsyn: boolean;
    aktivVedtaksperiode?: Vedtaksperiode;
    aktiverVedtaksperiode: (periodeId: string) => void;
    personTilBehandling?: Person;
}

interface PersonContextError {
    message: string;
    statusCode: number;
}

interface ProviderProps {
    children: ReactChild;
}

export const PersonContext = createContext<PersonContextType>({
    personTilBehandling: undefined,
    innsyn: false,
    hentPerson: _ => Promise.resolve(undefined),
    aktiverVedtaksperiode: _ => null
});

export const PersonProvider = ({ children }: ProviderProps) => {
    const [personTilBehandling, setPersonTilBehandling] = useState<Person>();
    const [error, setError] = useState<PersonContextError | undefined>();
    const [innsyn, setInnsyn] = useState(false);
    const [aktivVedtaksperiode, setAktivVedtaksperiode] = useState<Vedtaksperiode>();
    const location = useLocation();

    useEffect(() => {
        if (personTilBehandling) {
            const klarTilBehandling = (vedtaksperiode: Vedtaksperiode) => vedtaksperiode.kanVelges;
            const defaultVedtaksperiode = personTilBehandling.arbeidsgivere[0].vedtaksperioder.find(klarTilBehandling);
            setAktivVedtaksperiode(defaultVedtaksperiode as Vedtaksperiode);
        }
    }, [personTilBehandling]);

    useEffect(() => {
        if (location.pathname === '/') {
            // Vi er på oversiktbildet
            return;
        } else if (location.pathname.match(/\//g)!.length < 2) {
            setError({ statusCode: 1, message: `'${location.pathname}' er ikke en gyldig URL.` });
        }

        const sisteDelAvPath = location.pathname.match(/[^/]*$/)![0];
        const aktørId = sisteDelAvPath.match(/^\d{1,15}$/);
        if (aktørId) {
            hentPerson(aktørId[0]);
        } else {
            setError({ statusCode: 1, message: `'${sisteDelAvPath}' er ikke en gyldig aktør-ID.` });
        }
    }, [location.pathname]);

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
                setPersonTilBehandling(tilPerson(person, personinfo));
                return person;
            })
            .catch(err => {
                if (!err.statusCode) console.error(err);
                if (err.statusCode !== 401) {
                    const message =
                        err.statusCode === 404
                            ? `Fant ikke data for ${value}`
                            : 'Kunne ikke utføre søket. Prøv igjen senere.';
                    setError({ ...err, message });
                }
                return Promise.reject();
            });
    };

    const aktiverVedtaksperiode = useCallback(
        (periodeId: string) => {
            const vedtaksperiode = personTilBehandling?.arbeidsgivere[0].vedtaksperioder.find(
                periode => periode.id === periodeId
            );
            vedtaksperiode?.kanVelges && setAktivVedtaksperiode(vedtaksperiode as Vedtaksperiode);
        },
        [personTilBehandling]
    );

    return (
        <PersonContext.Provider
            value={{
                personTilBehandling,
                hentPerson,
                innsyn,
                aktivVedtaksperiode,
                aktiverVedtaksperiode
            }}
        >
            {children}
            {error && (
                <ErrorModal
                    errorMessage={error.message}
                    onClose={error.statusCode !== 401 ? () => setError(undefined) : () => {}}
                />
            )}
        </PersonContext.Provider>
    );
};

PersonProvider.propTypes = {
    children: PropTypes.node.isRequired
};
