import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import type { BeregnetPeriode, GhostPeriode, Person, UberegnetPeriode } from '@io/graphql';
import { currentPersonState } from '@state/person';
import { isBeregnetPeriode } from '@utils/typeguards';

type ActivePeriod = BeregnetPeriode | UberegnetPeriode | GhostPeriode;

const personHasPeriod = (person: Person, period: ActivePeriod): boolean => {
    return (
        person.arbeidsgivere
            .flatMap((it) => it.generasjoner.flatMap((it) => it.perioder as Array<ActivePeriod>))
            .find((it) => it.id === period.id) !== undefined ||
        person.arbeidsgivere.flatMap((it) => it.ghostPerioder).find((it) => it.id === period.id) !== undefined
    );
};

const activePeriodState = atom<ActivePeriod | null>({
    key: 'activePeriodState',
    default: null,
});

const activePeriod = selector<ActivePeriod | null>({
    key: 'activePeriod',
    get: async ({ get }) => {
        const person = await get(currentPersonState);
        if (!person) {
            return null;
        }

        const activePeriod = get(activePeriodState);
        if (activePeriod && personHasPeriod(person, activePeriod)) {
            return activePeriod;
        }

        const allPeriods = person.arbeidsgivere.flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? []);

        const periodWithOppgave: Maybe<BeregnetPeriode> =
            allPeriods
                .filter(isBeregnetPeriode)
                .find(
                    (periode) =>
                        isBeregnetPeriode(periode) &&
                        periode.behandlingstype === 'BEHANDLET' &&
                        typeof periode.oppgavereferanse === 'string',
                ) ?? null;

        const periode = periodWithOppgave ?? person.arbeidsgivere[0]?.generasjoner[0]?.perioder[0];

        return isBeregnetPeriode(periode) ? periode : null;
    },
});

export const useActivePeriod = () => useRecoilValue(activePeriod);

export const useSetActivePeriod = () => useSetRecoilState(activePeriodState);
