import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { Vedtaksperiode } from 'internal-types';
import { personState } from './person';

export const aktivVedtaksperiodeIdState = atom<string | undefined>({
    key: 'aktivVedtaksperiodeIdState',
    default: undefined,
});

export const aktivVedtaksperiodeState = selector<Vedtaksperiode | undefined>({
    key: 'aktivVedtaksperiodeState',
    get: async ({ get }) => {
        const person = get(personState)?.person;
        const periodeId = get(aktivVedtaksperiodeIdState) ?? person?.arbeidsgivere[0]?.vedtaksperioder[0]?.id;

        return person && periodeId
            ? person.arbeidsgivere.reduce(
                  (periode: Vedtaksperiode, { vedtaksperioder }) =>
                      periode ?? vedtaksperioder.find(({ id }) => id === periodeId),
                  undefined
              )
            : undefined;
    },
});

export const useSetAktivVedtaksperiode = () => useSetRecoilState(aktivVedtaksperiodeIdState);

export const useAktivVedtaksperiode = () => useRecoilValue(aktivVedtaksperiodeState);
