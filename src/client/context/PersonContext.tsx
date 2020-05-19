import React, { createContext, ReactChild, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorModal from '../components/ErrorModal';
import { tilPerson, tilPersonMedInfo } from './mapping/personmapper';
import { fetchPerson, getPersoninfo } from '../io/http';
import { Person, Vedtaksperiode } from './types.internal';

interface PersonContextType {
    hentPerson: (id: string) => Promise<Person | undefined>;
    innsyn: boolean;
    aktivVedtaksperiode?: Vedtaksperiode;
    aktiverVedtaksperiode: (periodeId: string) => void;
    oppdaterPerson: (aktørId: string) => Promise<Person | undefined>;
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
    aktiverVedtaksperiode: _ => null,
    oppdaterPerson: _ => Promise.resolve(undefined)
});

export const PersonProvider = ({ children }: ProviderProps) => {
    const [personTilBehandling, setPersonTilBehandling] = useState<Person>();
    const [aktørIdFromUrl, setAktørIdFromUrl] = useState<string | undefined>();
    const [error, setError] = useState<PersonContextError | undefined>();
    const [innsyn, setInnsyn] = useState(false);
    const [aktivVedtaksperiode, setAktivVedtaksperiode] = useState<Vedtaksperiode>();

    useEffect(() => {
        if (personTilBehandling) {
            const klarTilBehandling = (vedtaksperiode: Vedtaksperiode) => vedtaksperiode.kanVelges;
            const defaultVedtaksperiode = personTilBehandling.arbeidsgivere[0].vedtaksperioder.find(klarTilBehandling);
            setAktivVedtaksperiode(defaultVedtaksperiode as Vedtaksperiode);
        }
    }, [personTilBehandling]);

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

    const oppdaterPerson = (aktørId: string) => {
        return fetchPerson(aktørId, false)
            .then(response => {
                const oppdatertPerson = tilPersonMedInfo(response.data.person, personTilBehandling!.personinfo);
                setPersonTilBehandling(oppdatertPerson);
                return oppdatertPerson;
            })
            .catch(err => {
                if (!err.statusCode) console.error(err);
                if (err.statusCode !== 401) {
                    const message =
                        err.statusCode === 404
                            ? `Fant ikke data for ${aktørId}`
                            : 'Kunne ikke hente person. Prøv igjen senere.';
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
            vedtaksperiode && setAktivVedtaksperiode(vedtaksperiode as Vedtaksperiode);
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
                aktiverVedtaksperiode,
                oppdaterPerson
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
