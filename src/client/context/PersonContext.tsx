import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPerson, getPersoninfo } from '../io/http';
import { Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { Scopes, useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';
import { PersoninfoFraSparkel } from '../../types';
import { mapPerson } from '../mapping/person';

export interface PersonContextValue {
    hentPerson: (id: string) => Promise<Person | undefined>;
    markerPersonSomTildelt: (email?: string) => void;
    isFetching: boolean;
    aktivVedtaksperiode?: Vedtaksperiode;
    aktiverVedtaksperiode: (periodeId: string) => void;
    personTilBehandling?: Person;
}

export type FetchedPersonContext = Required<PersonContextValue>;

export const defaultPersonContext = {
    personTilBehandling: undefined,
    markerPersonSomTildelt: (_: string) => null,
    hentPerson: (_: string) => Promise.resolve(undefined),
    isFetching: false,
    aktiverVedtaksperiode: (_: string) => null,
};

export const PersonContext = createContext<PersonContextValue>(defaultPersonContext);

export const PersonProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [personTilBehandling, setPersonTilBehandling] = useState<Person>();
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();
    const [aktivVedtaksperiode, setAktivVedtaksperiode] = useState<Vedtaksperiode>();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (personTilBehandling) {
            const harOppgave = (vedtaksperiode: Vedtaksperiode) =>
                Vedtaksperiodetilstand.Oppgaver === vedtaksperiode.tilstand;
            const kanVelges = (vedtaksperiode: Vedtaksperiode) => vedtaksperiode.kanVelges;
            const perioder = personTilBehandling.arbeidsgivere.flatMap((it) => it.vedtaksperioder);
            const defaultVedtaksperiode = perioder.find(harOppgave) ?? perioder.find(kanVelges);
            setAktivVedtaksperiode(defaultVedtaksperiode as Vedtaksperiode);
        } else {
            setAktivVedtaksperiode(undefined);
        }
    }, [personTilBehandling]);

    const leggTilMappingVarsler = (problems: Error[]) => {
        const fjernDuplikater = (problem: Error, index: number, problems: Error[]) =>
            !problems.slice(index + 1).find(({ message }) => message === problem.message);
        problems.filter(fjernDuplikater).forEach((problem) => {
            leggTilVarsel({
                message: problem.message,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
        });
    };

    const hentPerson = (value: string) => {
        if (isNaN(Number(value))) {
            leggTilVarsel({
                message: 'Du kan kun søke på fødselsnummer eller aktør-ID.',
                scope: Scopes.GLOBAL,
                type: Varseltype.Advarsel,
            });
            return Promise.reject();
        }
        fjernVarsler();
        setPersonTilBehandling(undefined);
        setIsFetching(true);
        return fetchPerson(value)
            .then(async (response) => {
                const spesialistPerson = { ...response.data.person };
                const personinfoFraSparkel: PersoninfoFraSparkel | undefined =
                    spesialistPerson.personinfo.kjønn === null
                        ? await getPersoninfo(spesialistPerson.aktørId).then((response) => ({
                              ...response.data,
                          }))
                        : undefined;
                const { person, problems } = await mapPerson(spesialistPerson, personinfoFraSparkel);
                leggTilMappingVarsler(problems);
                setPersonTilBehandling(person);
                return person;
            })
            .catch((err) => {
                if (!err.statusCode) console.error(err);
                if (err.statusCode !== 401) {
                    const message =
                        err.statusCode === 404
                            ? `Personen har ingen utbetalinger i NAV Sykepenger`
                            : 'Kunne ikke utføre søket. Prøv igjen senere.';
                    const technical = err.message?.length > 0 ? `Feilmelding til utviklere: ${err.message}` : undefined;
                    leggTilVarsel({ ...err, message, technical, type: Varseltype.Advarsel });
                }
                return Promise.reject();
            })
            .finally(() => setIsFetching(false));
    };

    const aktiverVedtaksperiode = useCallback(
        (periodeId: string) => {
            const vedtaksperiode = personTilBehandling?.arbeidsgivere
                .find((arbeidsgiver) => arbeidsgiver.vedtaksperioder.find((periode) => periode.id === periodeId))
                ?.vedtaksperioder.find((periode) => periode.id === periodeId);
            vedtaksperiode?.kanVelges && setAktivVedtaksperiode(vedtaksperiode as Vedtaksperiode);
        },
        [personTilBehandling]
    );

    const markerPersonSomTildelt = (email: string) => {
        setPersonTilBehandling((prev) =>
            prev?.tildeltTil ? { ...prev, tildeltTil: undefined } : { ...prev!, tildeltTil: email }
        );
    };

    const contextValue = useMemo(
        () => ({
            personTilBehandling,
            markerPersonSomTildelt,
            hentPerson,
            isFetching,
            aktivVedtaksperiode,
            aktiverVedtaksperiode,
        }),
        [personTilBehandling, aktivVedtaksperiode, isFetching]
    );

    return useMemo(() => <PersonContext.Provider value={contextValue}>{children}</PersonContext.Provider>, [
        contextValue,
    ]);
};
