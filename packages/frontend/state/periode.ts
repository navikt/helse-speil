import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';

import { isBeregnetPeriode, isGhostPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';
import type { BeregnetPeriode, GhostPeriode, Person, UberegnetPeriode } from '@io/graphql';
import { Periode, Periodetilstand, Vilkarsgrunnlag } from '@io/graphql';
import { personState, useCurrentPerson } from '@state/person';

type ActivePeriod = BeregnetPeriode | UberegnetPeriode | GhostPeriode;

const personHasPeriod = (person: Person, period: ActivePeriod): boolean => {
    return (
        person.arbeidsgivere
            .flatMap((it) => it.generasjoner.flatMap((it) => it.perioder as Array<ActivePeriod>))
            .find((it) => it.id === period.id) !== undefined ||
        person.arbeidsgivere.flatMap((it) => it.ghostPerioder).find((it) => it.id === period.id) !== undefined
    );
};

export const isNotReady = (period: Periode) =>
    [
        Periodetilstand.VenterPaEnAnnenPeriode,
        Periodetilstand.ForberederGodkjenning,
        Periodetilstand.ManglerInformasjon,
    ].includes(period.periodetilstand);

const activePeriodState = atom<ActivePeriod | null>({
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
        if (activePeriod && personHasPeriod(person, activePeriod)) {
            return activePeriod;
        }

        const allPeriods = person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [])
            .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
            .filter(isBeregnetPeriode)
            .filter((it) => it.periodetilstand !== Periodetilstand.TilInfotrygd);

        const periodWithOppgave: Maybe<BeregnetPeriode> =
            allPeriods.find(
                (periode) =>
                    periode.periodetilstand === Periodetilstand.TilGodkjenning &&
                    typeof periode.oppgavereferanse === 'string',
            ) ?? null;

        const periode = periodWithOppgave ?? allPeriods[0];

        return isBeregnetPeriode(periode) ? periode : null;
    },
});

export const useActivePeriod = (): ActivePeriod | null => useRecoilValue(activePeriod);

export const useSetActivePeriod = () => useSetRecoilState(activePeriodState);

const bySkjæringstidspunktDescending = (a: Vilkarsgrunnlag, b: Vilkarsgrunnlag): number => {
    return new Date(b.skjaeringstidspunkt).getTime() - new Date(a.skjaeringstidspunkt).getTime();
};

export const useCurrentVilkårsgrunnlag = (): Vilkarsgrunnlag | null => {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!currentPerson || !activePeriod || isUberegnetPeriode(activePeriod) || isGhostPeriode(activePeriod))
        return null;

    const periode = activePeriod as BeregnetPeriode;
    return (
        currentPerson?.vilkarsgrunnlaghistorikk
            .find((it) => it.id === periode.vilkarsgrunnlaghistorikkId)
            ?.grunnlag.filter(
                (it) =>
                    dayjs(it.skjaeringstidspunkt).isSameOrAfter(periode.skjaeringstidspunkt) &&
                    dayjs(it.skjaeringstidspunkt).isSameOrBefore(activePeriod.tom),
            )
            .sort(bySkjæringstidspunktDescending)
            .pop() ?? null
    );
};
