import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { fetchPerson, Person, Vilkarsgrunnlag } from '@io/graphql';

export const currentPersonIdState = atom<string | null>({
    key: 'currentPersonId',
    default: null,
});

export const currentPersonState = selector<Person | null>({
    key: 'currentPersonState',
    get: ({ get }) => {
        const id = get(currentPersonIdState);

        if (typeof id === 'string') {
            return fetchPerson(id).then((res) => res.person ?? null);
        } else {
            return Promise.resolve(null);
        }
    },
});

export const useCurrentPerson = (): Person | null => {
    return useRecoilValue(currentPersonState);
};

export const useFetchPerson = (): ((id: string) => void) => {
    return useSetRecoilState(currentPersonIdState);
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
