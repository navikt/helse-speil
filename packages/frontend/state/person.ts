import dayjs from 'dayjs';
import { atom, Loadable, useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil';
import { GraphQLError } from 'graphql';

import { useActivePeriod } from '@state/periode';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { fetchPerson, Maybe, Overstyring, Person, Vilkarsgrunnlag } from '@io/graphql';
import { FetchError, isFetchErrorArray, NotFoundError, ProtectedError } from '@io/graphql/errors';
import { deletePåVent, deleteTildeling, NotatDTO, postLeggPåVent, postTildeling, SpeilResponse } from '@io/http';
import { isBeregnetPeriode } from '@utils/typeguards';
import { SpeilError } from '@utils/error';

const TILDELINGSKEY = 'tildeling';

class TildelingAlert extends SpeilError {
    name = TILDELINGSKEY;

    constructor(message: string) {
        super(message);
        this.severity = 'info';
    }
}

type PersonState = {
    person: Maybe<Person>;
    errors: Array<SpeilError>;
    loading: boolean;
};

const fetchPersonState = (id: string): Promise<PersonState> => {
    return fetchPerson(id)
        .then((res) => {
            return Promise.resolve({
                person: res.person ?? null,
                errors: [],
                loading: false,
            });
        })
        .catch((e) => {
            const errors = e.response.errors.map((error: GraphQLError) => {
                switch (error.extensions?.code) {
                    case 403: {
                        return new ProtectedError();
                    }
                    case 404: {
                        return new NotFoundError();
                    }
                    default: {
                        return new FetchError();
                    }
                }
            });
            return Promise.resolve({
                person: null,
                errors: errors,
                loading: false,
            });
        });
};

const emptyPersonState = (): PersonState => ({
    person: null,
    errors: [],
    loading: false,
});

export const personState = atom<PersonState>({
    key: 'CurrentPerson',
    default: emptyPersonState(),
});

export const useCurrentPerson = (): Person | null => useRecoilValue(personState).person;

export const usePersonErrors = (): Array<SpeilError> => {
    return useRecoilValue(personState).errors;
};

export const useFetchPerson = (): ((id: string) => Promise<PersonState>) => {
    const setPersonState = useSetRecoilState(personState);
    return async (id: string) => {
        setPersonState((prevState) => ({ ...prevState, loading: true }));
        return fetchPersonState(id).then((state) => {
            setPersonState(state);
            return Promise.resolve(state);
        });
    };
};

export const useRefetchPerson = (): (() => Promise<PersonState | null>) => {
    const personId = useRecoilValue(personState).person?.fodselsnummer;
    const fetchPerson = useFetchPerson();
    return () => {
        if (personId) {
            return fetchPerson(personId);
        } else {
            return Promise.resolve(null);
        }
    };
};

export const usePersonLoadable = (): Loadable<Person | null> => {
    const loadable = useRecoilValueLoadable(personState);

    if (loadable.state === 'hasValue' && isFetchErrorArray(loadable.contents.errors)) {
        return { state: 'hasValue', contents: null } as Loadable<null>;
    }

    return { state: loadable.state, contents: loadable.contents.person ?? null } as Loadable<Person | null>;
};

export const useResetPerson = (): (() => void) => {
    const resetPerson = useResetRecoilState(personState);
    return () => {
        resetPerson();
    };
};

export const useIsFetchingPerson = (): boolean => {
    return useRecoilValue(personState).loading;
};

export const useTildelPerson = (): ((oppgavereferanse: string) => Promise<void>) => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const setPersonState = useSetRecoilState(personState);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    return async (oppgavereferanse: string) => {
        removeVarsel(TILDELINGSKEY);
        return postTildeling(oppgavereferanse)
            .then(() => {
                setPersonState((prevState) => ({
                    ...prevState,
                    person: prevState.person && {
                        ...prevState.person,
                        tildeling: {
                            ...innloggetSaksbehandler,
                            reservert: false,
                        },
                    },
                }));
            })
            .catch(async (error) => {
                if (error.statusCode === 409) {
                    const respons: any = await JSON.parse(error.message);
                    const { navn } = respons.kontekst.tildeling;
                    addVarsel(new TildelingAlert(`${navn} har allerede tatt saken.`));
                } else {
                    addVarsel(new TildelingAlert('Kunne ikke tildele sak.'));
                }
            });
    };
};

export const useFjernTildeling = (): ((oppgavereferanse: string) => Promise<void>) => {
    const addVarsel = useAddVarsel();
    const removeVarsel = useRemoveVarsel();
    const setPersonState = useSetRecoilState(personState);

    return async (oppgavereferanse: string) => {
        removeVarsel(TILDELINGSKEY);
        return deleteTildeling(oppgavereferanse)
            .then(() => {
                setPersonState((prevState) => ({
                    ...prevState,
                    person: prevState.person && {
                        ...prevState.person,
                        tildeling: null,
                    },
                }));
            })
            .catch(() => addVarsel(new TildelingAlert('Kunne ikke fjerne tildeling av sak.')));
    };
};

export const useLeggPåVent = (): ((oppgavereferanse: string, notat: NotatDTO) => Promise<SpeilResponse>) => {
    const setPersonState = useSetRecoilState(personState);

    return (oppgavereferanse: string, notat: NotatDTO) => {
        return postLeggPåVent(oppgavereferanse, notat).then((response) => {
            setPersonState((prevState) => ({
                ...prevState,
                person: prevState.person && {
                    ...prevState.person,
                    tildeling: prevState.person.tildeling && {
                        ...prevState.person.tildeling,
                        reservert: true,
                    },
                },
            }));
            return Promise.resolve(response);
        });
    };
};

export const useFjernPåVent = (): ((oppgavereferanse: string) => Promise<SpeilResponse>) => {
    const setPersonState = useSetRecoilState(personState);

    return (oppgavereferanse) => {
        return deletePåVent(oppgavereferanse).then((response) => {
            setPersonState((prevState) => ({
                ...prevState,
                person: prevState.person && {
                    ...prevState.person,
                    tildeling: prevState.person.tildeling && {
                        ...prevState.person.tildeling,
                        reservert: false,
                    },
                },
            }));
            return Promise.resolve(response);
        });
    };
};

const bySkjæringstidspunktDescending = (a: Vilkarsgrunnlag, b: Vilkarsgrunnlag): number => {
    return new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime();
};

export const useVilkårsgrunnlag = (id: string, skjæringstidspunkt: DateString): Vilkarsgrunnlag | null => {
    const currentPerson = useCurrentPerson();
    const activePeriod = useActivePeriod();

    return (
        (activePeriod &&
            currentPerson?.vilkarsgrunnlaghistorikk
                .find((it) => it.id === id)
                ?.grunnlag.filter(
                    (it) =>
                        dayjs(it.skjaeringstidspunkt).isSameOrAfter(skjæringstidspunkt) &&
                        dayjs(it.skjaeringstidspunkt).isSameOrBefore(activePeriod.tom),
                )
                .sort(bySkjæringstidspunktDescending)
                .pop()) ??
        null
    );
};

const useEndringerForPerson = (): Array<Overstyring> =>
    useCurrentPerson()?.arbeidsgivere?.flatMap((arbeidsgiver) => arbeidsgiver.overstyringer) ?? [];

const useNyesteUtbetalingstidsstempelForPerson = (): Dayjs => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    const MIN_DATE = dayjs('1970-01-01');

    if (!isBeregnetPeriode(activePeriod) || !currentPerson) {
        return MIN_DATE;
    }

    const nyesteUtbetalingstidsstempel =
        currentPerson.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner)
            .flatMap((generasjon) => generasjon.perioder)
            .filter((periode) => isBeregnetPeriode(periode) && periode.utbetaling.vurdering?.godkjent)
            .map((periode) =>
                isBeregnetPeriode(periode) ? dayjs(periode.utbetaling.vurdering?.tidsstempel) : MIN_DATE,
            ) ?? MIN_DATE;

    return dayjs.max([...nyesteUtbetalingstidsstempel, MIN_DATE]);
};

export const useEndringerEtterNyesteUtbetaltetidsstempel = (): Array<Overstyring> => {
    const nyesteUtbetalingstidsstempelForPerson = useNyesteUtbetalingstidsstempelForPerson();

    return (
        useEndringerForPerson().filter((overstyring) =>
            dayjs(overstyring.timestamp).isAfter(nyesteUtbetalingstidsstempelForPerson),
        ) ?? []
    );
};

export const useHarEndringerEtterNyesteUtbetaltetidsstempel = (): boolean => {
    const endringerEtterNyesteUtbetaltetidsstempel = useEndringerEtterNyesteUtbetaltetidsstempel();

    return endringerEtterNyesteUtbetaltetidsstempel.length > 0;
};
