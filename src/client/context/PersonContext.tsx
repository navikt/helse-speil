import React, { createContext, ReactChild, useCallback, useEffect, useMemo, useState } from 'react';
import { tilPerson } from './mapping/personmapper';
import { fetchPerson, getPersoninfo } from '../io/http';
import { Person, Vedtaksperiode } from './types.internal';

interface PersonContextType {
    hentPerson: (id: string) => Promise<Person | undefined>;
    innsyn: boolean;
    aktivVedtaksperiode?: Vedtaksperiode;
    aktiverVedtaksperiode: (periodeId: string) => void;
    personTilBehandling?: Person;
    error?: PersonContextError;
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
    hentPerson: (_) => Promise.resolve(undefined),
    aktiverVedtaksperiode: (_) => null,
});

export const PersonProvider = ({ children }: ProviderProps) => {
    const [personTilBehandling, setPersonTilBehandling] = useState<Person>();
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

    const hentPerson = (value: string) => {
        const innsyn = value.length === 26;
        setInnsyn(innsyn);
        return fetchPerson(value, innsyn)
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
                    setError({ ...err, message });
                }
                return Promise.reject();
            });
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

    const contextValue = useMemo(
        () => ({
            personTilBehandling,
            hentPerson,
            error,
            innsyn,
            aktivVedtaksperiode,
            aktiverVedtaksperiode,
        }),
        [personTilBehandling, error, aktivVedtaksperiode]
    );

    return useMemo(() => <PersonContext.Provider value={contextValue}>{children}</PersonContext.Provider>, [
        contextValue,
    ]);
};
