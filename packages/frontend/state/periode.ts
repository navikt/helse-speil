import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import type { BeregnetPeriode, GhostPeriode, UberegnetPeriode } from '@io/graphql';
import { currentPersonState } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

const activePeriodState = atom<BeregnetPeriode | UberegnetPeriode | GhostPeriode | null>({
    key: 'activePeriodState',
    default: null,
});

const activePeriod = selector<BeregnetPeriode | UberegnetPeriode | GhostPeriode | null>({
    key: 'activePeriod',
    get: async ({ get }) => {
        const activePeriod = get(activePeriodState);
        if (activePeriod) {
            return activePeriod;
        }

        const person = await get(currentPersonState);
        if (!person) {
            return null;
        }

        const firstAvailablePeriod = person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
            .find(
                (periode) =>
                    isBeregnetPeriode(periode) &&
                    periode.behandlingstype === 'BEHANDLET' &&
                    typeof periode.oppgavereferanse === 'string',
            );

        const periode = firstAvailablePeriod ?? person.arbeidsgivere[0]?.generasjoner[0]?.perioder[0];

        return isBeregnetPeriode(periode) ? periode : null;
    },
});

export const useActivePeriod = () => useRecoilValue(activePeriod);

export const useSetActivePeriod = () => useSetRecoilState(activePeriodState);
