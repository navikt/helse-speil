import { atom, selector, useSetRecoilState } from 'recoil';
import { Arbeidsgiver, Vedtaksperiode } from 'internal-types';
import { personState } from './person';

const aktivVedtaksperiodeId = atom<string | undefined>({
    key: 'aktivVedtaksperiodeId',
    default: undefined,
});

export const aktivVedtaksperiodeState = selector<Vedtaksperiode | undefined>({
    key: 'aktivVedtaksperiodeState',
    get: async ({ get }) => {
        const state = await get(personState);
        const periodeId = get(aktivVedtaksperiodeId);

        if (!state || !periodeId) return undefined;

        return state.person.arbeidsgivere.reduce(
            (vedtaksperiode: Vedtaksperiode, { vedtaksperioder }: Arbeidsgiver) =>
                vedtaksperiode ??
                (vedtaksperioder.find(({ id, kanVelges }) => kanVelges && id === periodeId) as Vedtaksperiode),
            undefined
        );
    },
});

export const useSetAktivVedtaksperiode = () => {
    const setAktivVedtaksperiodeId = useSetRecoilState(aktivVedtaksperiodeId);
    return (id: string) => setAktivVedtaksperiodeId(id);
};
