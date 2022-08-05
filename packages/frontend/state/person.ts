import dayjs from 'dayjs';
import {
    atom,
    Loadable,
    selector,
    useRecoilValue,
    useRecoilValueLoadable,
    useResetRecoilState,
    useSetRecoilState,
} from 'recoil';
import { GraphQLError } from 'graphql';

import { useActivePeriod } from '@state/periode';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { FetchError, isFetchErrorArray, NotFoundError, ProtectedError } from '@io/graphql/errors';
import { fetchPerson, Maybe, Overstyring, Person, Tildeling, Vilkarsgrunnlag } from '@io/graphql';
import { deletePåVent, NotatDTO, postLeggPåVent, SpeilResponse } from '@io/http';
import { SpeilError } from '@utils/error';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

type PersonState = {
    person: Maybe<Person>;
    errors: Array<SpeilError>;
};

const currentPersonIdState = atom<string | null>({
    key: 'currentPersonId',
    default: null,
});

const personRefetchKeyState = atom<Date>({
    key: 'personRefetchKeyState',
    default: new Date(),
});

/* Når denne er satt til "undefined" vil det si at vi ønsker å bruke tildelingen fra
 * personobjektet. "null" eller et tildelingsobjekt betyr at vi ønsker å bruke den
 * lokale tildelingen.
 */
const localTildelingState = atom<Maybe<Tildeling> | undefined>({
    key: 'localTildeling',
    default: undefined,
});

const fetchedPersonState = selector<PersonState>({
    key: 'fetchedPersonState',
    get: ({ get }) => {
        get(personRefetchKeyState);
        const id = get(currentPersonIdState);

        if (typeof id === 'string') {
            return fetchPerson(id)
                .then((res) => {
                    return Promise.resolve({
                        person: res.person ?? null,
                        errors: [],
                    });
                })
                .catch((e) => {
                    const errors = e.response.errors.map((error: GraphQLError) => {
                        switch (error.extensions.code) {
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
                    });
                });
        } else {
            return Promise.resolve({
                person: null,
                errors: [],
            });
        }
    },
});

export const currentPersonState = selector<PersonState>({
    key: 'currentPersonState',
    get: ({ get }) => {
        const { person, ...rest } = get(fetchedPersonState);
        if (!isPerson(person)) {
            return {
                person: null,
                ...rest,
            };
        }

        const localTildeling = get(localTildelingState);
        if (localTildeling !== undefined) {
            return {
                person: {
                    ...person,
                    tildeling: localTildeling,
                },
                ...rest,
            };
        }

        return { person, ...rest };
    },
});

export const useCurrentPerson = (): Person | null => useRecoilValue(currentPersonState).person;

export const useFetchPerson = (): ((id: string) => void) => {
    return useSetRecoilState(currentPersonIdState);
};

export const useRefetchPerson = (): (() => void) => {
    const setKey = useSetRecoilState(personRefetchKeyState);
    return () => {
        setKey(new Date());
    };
};

export const useFetchErrors = (): Array<SpeilError> | null => {
    const personState = useRecoilValueLoadable(currentPersonState);

    if (personState.state === 'hasValue' && isFetchErrorArray(personState.contents.errors)) {
        return personState.contents.errors;
    }

    return null;
};

export const usePersonLoadable = (): Loadable<Person | null> => {
    const loadable = useRecoilValueLoadable(currentPersonState);

    if (loadable.state === 'hasValue' && isFetchErrorArray(loadable.contents.errors)) {
        return { state: 'hasValue', contents: null } as Loadable<null>;
    }

    return { state: loadable.state, contents: loadable.contents.person ?? null } as Loadable<Person | null>;
};

export const useResetPerson = (): (() => void) => {
    const setPersonId = useSetRecoilState(currentPersonIdState);
    return () => {
        setPersonId(null);
    };
};

export const useTildelPerson = (): ((påVent?: boolean) => void) => {
    const setTildeling = useSetRecoilState(localTildelingState);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    return (påVent = false) => {
        setTildeling({ ...innloggetSaksbehandler, reservert: påVent });
    };
};

export const useMeldAvLokalTildeling = (): (() => void) => {
    const setTildeling = useSetRecoilState(localTildelingState);

    return () => {
        setTildeling(null);
    };
};

// Tilbakestiller tildeling-state til opprinnelig, slik at tildeling-info i hentet data "vinner"
export const useMarkerPersonSomIkkeTildelt = (): (() => void) => {
    const resetTildeling = useResetRecoilState(localTildelingState);

    return () => {
        resetTildeling();
    };
};

export const useTilbakestillTildeling = (): (() => void) => {
    const setTildeling = useSetRecoilState(localTildelingState);

    return () => {
        setTildeling(undefined);
    };
};

export const useLeggPåVent = (): ((oppgavereferanse: string, notat: NotatDTO) => Promise<SpeilResponse>) => {
    const tildelPerson = useTildelPerson();

    return (oppgavereferanse, notat) => {
        return postLeggPåVent(oppgavereferanse, notat).then((response) => {
            tildelPerson(true);
            return Promise.resolve(response);
        });
    };
};

export const useFjernPåVent = (): ((oppgavereferanse: string) => Promise<SpeilResponse>) => {
    const tildelPerson = useTildelPerson();

    return (oppgavereferanse) => {
        return deletePåVent(oppgavereferanse).then((response) => {
            tildelPerson(false);
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
