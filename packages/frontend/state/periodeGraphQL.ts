import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import type { BeregnetPeriode, UberegnetPeriode } from '@io/graphql';

const activePeriodState = atom<BeregnetPeriode | UberegnetPeriode | null>({
    key: 'activePeriodState',
    default: null,
});

export const useActivePeriod = () => useRecoilValue(activePeriodState);

export const useSetActivePeriod = () => useSetRecoilState(activePeriodState);
