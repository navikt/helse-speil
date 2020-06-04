import React, { createContext, ReactChild, useCallback, useEffect, useMemo, useState } from 'react';
import { tilPerson } from './mapping/personmapper';
import { fetchPerson, getPersoninfo } from '../io/http';
import { Person, Vedtaksperiode } from './types.internal';

interface PersonContextType {
    hentPerson: (id: string) => Promise<Person | undefined>;
    tildelPerson: (email?: string) => void;
    isFetching: boolean;
    aktivVedtaksperiode?: Vedtaksperiode;
    aktiverVedtaksperiode: (periodeId: string) => void;
    personTilBehandling?: Person;
    error?: PersonContextError;
}

interface PersonContextError {
    message: string;
    statusCode: number;
    technical: string;
}

interface ProviderProps {
    children: ReactChild;
}

export const PersonContext = createContext<PersonContextType>({
    personTilBehandling: undefined,
    tildelPerson: (_) => null,
    hentPerson: (_) => Promise.resolve(undefined),
    isFetching: false,
    aktiverVedtaksperiode: (_) => null,
});

export const PersonProvider = ({ children }: ProviderProps) => {
    const [personTilBehandling, setPersonTilBehandling] = useState<Person>();
    const [error, setError] = useState<PersonContextError | undefined>();
    const [aktivVedtaksperiode, setAktivVedtaksperiode] = useState<Vedtaksperiode>();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (personTilBehandling) {
            const klarTilBehandling = (vedtaksperiode: Vedtaksperiode) => vedtaksperiode.kanVelges;
            const defaultVedtaksperiode = personTilBehandling.arbeidsgivere[0].vedtaksperioder.find(klarTilBehandling);
            setAktivVedtaksperiode(defaultVedtaksperiode as Vedtaksperiode);
        } else {
            setAktivVedtaksperiode(undefined);
        }
    }, [personTilBehandling]);

    const hentPerson = (value: string) => {
        setError(undefined);
        setPersonTilBehandling(undefined);
        setIsFetching(true);
        return fetchPerson(value)
            .then(async (response) => {
                const aktørId = response.data.person.aktørId;
                const personinfo = await getPersoninfo(aktørId).then((response) => ({
                    ...response.data,
                }));
                const person = { ...response.data.person, personinfo };
                setPersonTilBehandling(tilPerson(person, personinfo));
                return person;
            })
            .catch((err) => {
                if (!err.statusCode) console.error(err);
                if (err.statusCode !== 401) {
                    const message =
                        err.statusCode === 404
                            ? `Fant ikke data for ${value}`
                            : 'Kunne ikke utføre søket. Prøv igjen senere.';
                    const technical = err.message?.length > 0 ? `Feilmelding til utviklere: ${err.message}` : '';
                    setError({ ...err, message, technical });
                }
                return Promise.reject();
            })
            .finally(() => setIsFetching(false));
    };

    const aktiverVedtaksperiode = useCallback(
        (periodeId: string) => {
            const vedtaksperiode = personTilBehandling?.arbeidsgivere[0].vedtaksperioder.find(
                (periode) => periode.id === periodeId
            );
            vedtaksperiode?.kanVelges && setAktivVedtaksperiode(vedtaksperiode as Vedtaksperiode);
        },
        [personTilBehandling]
    );

    const tildelPerson = (email: string) => {
        setPersonTilBehandling((prev) => ({ ...prev!, tildeltTil: email }));
    };

    const contextValue = useMemo(
        () => ({
            personTilBehandling,
            tildelPerson,
            hentPerson,
            isFetching,
            error,
            aktivVedtaksperiode,
            aktiverVedtaksperiode,
        }),
        [personTilBehandling, error, aktivVedtaksperiode, isFetching]
    );

    return useMemo(() => <PersonContext.Provider value={contextValue}>{children}</PersonContext.Provider>, [
        contextValue,
    ]);
};
