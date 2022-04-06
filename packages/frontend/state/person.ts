import { atom, Loadable, selector, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import type { Maybe, Person, Tildeling, Vilkarsgrunnlag } from '@io/graphql';
import { fetchPerson } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { deletePåVent, postLeggPåVent, SpeilResponse } from '@io/http';

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

export const currentPersonState = selector<Person | null>({
    key: 'currentPersonState',
    get: ({ get }) => {
        get(personRefetchKeyState);
        const id = get(currentPersonIdState);

        if (typeof id === 'string') {
            return fetchPerson(id).then((res) => res.person ?? null);
        } else {
            return Promise.resolve(null);
        }
    },
});

export const useCurrentPerson = (): Person | null => {
    const person = useRecoilValue(currentPersonState);
    console.log(person);
    const localTildeling = useRecoilValue(localTildelingState);

    return (
        person && {
            ...person,
            tildeling: localTildeling === undefined ? person.tildeling : localTildeling,
        }
    );
};

export const useFetchPerson = (): ((id: string) => void) => {
    return useSetRecoilState(currentPersonIdState);
};

export const useRefetchPerson = (): (() => void) => {
    const setKey = useSetRecoilState(personRefetchKeyState);
    return () => {
        setKey(new Date());
    };
};

export const usePersonLoadable = (): Loadable<Person | null> => {
    return useRecoilValueLoadable(currentPersonState);
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

export const useFjernTildelingFraPerson = (): (() => void) => {
    const setTildeling = useSetRecoilState(localTildelingState);

    return () => {
        setTildeling(null);
    };
};

export const useLeggPåVent = (): ((oppgavereferanse: string) => Promise<SpeilResponse>) => {
    const tildelPerson = useTildelPerson();

    return (oppgavereferanse) => {
        return postLeggPåVent(oppgavereferanse).then((response) => {
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

export const useVilkårsgrunnlag = (id: string, skjæringstidspunkt: DateString): Vilkarsgrunnlag | null => {
    const currentPerson = useCurrentPerson();

    return (
        currentPerson?.vilkarsgrunnlaghistorikk
            .find((it) => it.id === id)
            ?.grunnlag.filter((it) => it.skjaeringstidspunkt === skjæringstidspunkt)
            ?.pop() ?? null
    );
};
