import { GraphQLError } from 'graphql';
import {
    Loadable,
    atom,
    selector,
    useRecoilValue,
    useRecoilValueLoadable,
    useResetRecoilState,
    useSetRecoilState,
} from 'recoil';

import { Maybe, Person, fetchPerson } from '@io/graphql';
import {
    FetchError,
    FlereFodselsnumreError,
    NotFoundError,
    ProtectedError,
    isFetchErrorArray,
} from '@io/graphql/errors';
import { NotatDTO, SpeilResponse, deletePåVent, postLeggPåVent } from '@io/http';
import { activePeriod, activePeriodState } from '@state/periode';
import { tildelingState } from '@state/tildeling';
import { SpeilError } from '@utils/error';

type PersonState = {
    person: Maybe<FetchedPerson>;
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
        .catch(({ response }) => {
            const errors = response.errors.map((error: GraphQLError) => {
                switch (error.extensions?.code) {
                    case 403: {
                        throw new ProtectedError();
                    }
                    case 404: {
                        throw new NotFoundError();
                    }
                    case 500: {
                        if (error.extensions.feilkode === 'HarFlereFodselsnumre') {
                            const fodselsnumre = error.extensions.fodselsnumre;
                            throw new FlereFodselsnumreError(fodselsnumre as string[]);
                        } else throw new FetchError();
                    }
                    default: {
                        throw new FetchError();
                    }
                }
            });
            return Promise.reject(errors);
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

export const useCurrentPerson = (): Maybe<FetchedPerson> => {
    return useRecoilValue(fetchedPersonSelector);
};

export const fetchedPersonSelector = selector<Maybe<FetchedPerson>>({
    key: 'fetchedPersonSelector',
    get: ({ get }) => {
        const tildelinger = get(tildelingState);
        const aktivPeriode = get(activePeriod) as FetchedBeregnetPeriode;
        const person = get(personState).person;
        if (person === null) return null;
        return {
            ...person,
            tildeling:
                aktivPeriode?.oppgave !== undefined &&
                aktivPeriode?.oppgave?.id !== undefined &&
                tildelinger[aktivPeriode.oppgave.id] !== undefined
                    ? tildelinger[aktivPeriode.oppgave.id]
                    : person?.tildeling,
        } as FetchedPerson;
    },
});

export const useFetchPerson = (): ((id: string) => Promise<PersonState | void>) => {
    const setPerson = useSetRecoilState(personState);
    const setActivePeriod = useSetRecoilState(activePeriodState);

    return async (id: string) => {
        setPerson((prevState) => (prevState.person ? prevState : { ...prevState, loading: true }));
        return fetchPersonState(id)
            .then((state) => {
                setPerson(state);
                setActivePeriod((prevState) => {
                    return (
                        state.person?.arbeidsgivere
                            .flatMap((arbeidsgiver) =>
                                arbeidsgiver.generasjoner.flatMap((it) => it.perioder as Array<ActivePeriod>),
                            )
                            .find((it) => it.id === prevState?.id) ?? null
                    );
                });

                return Promise.resolve(state);
            })
            .catch((errors) => {
                setPerson((prevState) => ({ ...prevState, errors, loading: false }));
            });
    };
};

export const useRefetchPerson = (): (() => Promise<PersonState | null>) => {
    const personId = useRecoilValue(personState).person?.fodselsnummer;
    const fetchPerson = useFetchPerson();

    return async () => {
        if (personId) {
            const personState = await fetchPerson(personId);
            return Promise.resolve(personState ?? null);
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
    return useResetRecoilState(personState);
};

export const useIsFetchingPerson = (): boolean => {
    return useRecoilValue(personState).loading;
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
