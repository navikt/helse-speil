import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { Periodetilstand } from '@io/graphql';
import { personState } from '@state/person';
import { hasPeriod } from '@state/selectors/person';
import { isBeregnetPeriode, isPerson, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

export const activePeriodState = atom<ActivePeriod | null>({
    key: 'activePeriodState',
    default: null,
});

export const activePeriod = selector<ActivePeriod | null>({
    key: 'activePeriod',
    get: ({ get }) => {
        const { person } = get(personState);
        if (!isPerson(person)) {
            return null;
        }

        const activePeriod = get(activePeriodState);
        if (activePeriod && hasPeriod(person, activePeriod)) {
            return activePeriod;
        }

        const allPeriods = person?.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
            .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
            .filter((period) => isBeregnetPeriode(period) || isUberegnetVilkarsprovdPeriode(period))
            .filter((it) => it.periodetilstand !== Periodetilstand.TilInfotrygd);

        const periodWithOppgave =
            allPeriods.find(
                (periode) =>
                    (isBeregnetPeriode(periode) &&
                        periode.periodetilstand === Periodetilstand.TilGodkjenning &&
                        typeof periode.oppgave?.id === 'string') ||
                    (isUberegnetVilkarsprovdPeriode(periode) &&
                        periode.periodetilstand === Periodetilstand.TilSkjonnsfastsettelse),
            ) ?? null;

        const periode = periodWithOppgave ?? allPeriods[0];

        return isBeregnetPeriode(periode) || isUberegnetVilkarsprovdPeriode(periode) ? periode : null;
    },
});

export const useActivePeriod = (): ActivePeriod | null => useRecoilValue(activePeriod);

export const useSetActivePeriod = () => useSetRecoilState(activePeriodState);
