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
import { fetchPerson, Maybe, Person, Tildeling, Vilkarsgrunnlag } from '@io/graphql';
import { deletePåVent, NotatDTO, postLeggPåVent, SpeilResponse } from '@io/http';
import { SpeilError } from '@utils/error';
import { isPerson } from '@utils/typeguards';

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

const fetchedPersonState = selector<Person | Array<FetchError> | null>({
    key: 'fetchedPersonState',
    get: ({ get }) => {
        get(personRefetchKeyState);
        const id = get(currentPersonIdState);

        if (typeof id === 'string') {
            return fetchPerson(id)
                .then((res) => res.person ?? null)
                .catch((e) => {
                    return e.response.errors.map((error: GraphQLError) => {
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
                });
        } else {
            return Promise.resolve(null);
        }
    },
});

export const currentPersonState = selector<Person | null>({
    key: 'currentPersonState',
    get: ({ get }) => {
        const person = get(fetchedPersonState);
        if (!person) return null;

        const localTildeling = get(localTildelingState);
        if (localTildeling !== undefined) {
            return {
                ...person,
                tildeling: localTildeling,
            };
        }

        return person;
    },
});
export const useCurrentPerson = (): Person | null => useRecoilValue(currentPersonState);

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

    if (personState.state === 'hasValue' && isFetchErrorArray(personState.contents)) {
        return personState.contents;
    }

    return null;
};

export const usePersonLoadable = (): Loadable<Person | null> => {
    const loadable = useRecoilValueLoadable(currentPersonState);

    if (loadable.state === 'hasValue' && isFetchErrorArray(loadable.contents)) {
        return { ...loadable, contents: null } as Loadable<null>;
    }

    return loadable as Loadable<Person | null>;
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
