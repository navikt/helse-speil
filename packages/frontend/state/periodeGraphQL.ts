import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { BeregnetPeriode, UberegnetPeriode } from '@io/graphql';

const aktivPeriodeGraphQLState = atom<BeregnetPeriode | UberegnetPeriode | null>({
    key: 'aktivPeriodeGraphQLState',
    default: null,
});

export const useAktivPeriode = () => useRecoilValue(aktivPeriodeGraphQLState);

export const useSetAktivPeriode = () => useSetRecoilState(aktivPeriodeGraphQLState);
