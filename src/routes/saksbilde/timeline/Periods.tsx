import dayjs, { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { GhostPeriodeFragment, Periode, Periodetilstand, PersonFragment } from '@io/graphql';
import { isNotReady } from '@state/selectors/period';
import { DatePeriod, InfotrygdPeriod } from '@typer/shared';
import { TimelinePeriod } from '@typer/timeline';
import { isBeregnetPeriode, isGhostPeriode, isInfotrygdPeriod, isUberegnetPeriode } from '@utils/typeguards';

import { Period } from './Period';
import { usePeriodStyling } from './hooks/usePeriodStyling';
import { usePopulateNeighbours } from './hooks/usePopulateNeighbours';
import { useVisiblePeriods } from './hooks/useVisiblePeriods';

import styles from './Periods.module.css';

const byFomDescending = (a: DatePeriod, b: DatePeriod): number => dayjs(b.fom).diff(dayjs(a.fom));

const filterReadyPeriods = (periods: Periode[]): Periode[] =>
    periods.filter((it) => !(it.erForkastet && isNotReady(it)));

const filterValidPeriods = (periods: DatePeriod[]): DatePeriod[] =>
    periods.filter(
        (it) =>
            (isBeregnetPeriode(it) && it.periodetilstand !== Periodetilstand.TilInfotrygd) ||
            isUberegnetPeriode(it) ||
            isInfotrygdPeriod(it) ||
            (isGhostPeriode(it) && !it.deaktivert),
    );

const isActive = (activePeriod: TimelinePeriod | null, currentPeriod: TimelinePeriod | null): boolean => {
    if (isGhostPeriode(activePeriod) && isGhostPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isBeregnetPeriode(activePeriod) && isBeregnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else if (isUberegnetPeriode(activePeriod) && isUberegnetPeriode(currentPeriod)) {
        return activePeriod.id === currentPeriod.id;
    } else {
        return false;
    }
};

const mergePeriods = (
    fromSpleis: Periode[],
    fromInfotrygd: InfotrygdPeriod[],
    ghostPeriods: GhostPeriodeFragment[],
): TimelinePeriod[] => {
    const periodsFromSpleis = filterReadyPeriods(fromSpleis);
    return [...periodsFromSpleis, ...fromInfotrygd, ...ghostPeriods].sort(byFomDescending);
};

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    periods: Periode[];
    activePeriod: TimelinePeriod | null;
    infotrygdPeriods?: InfotrygdPeriod[];
    ghostPeriods?: GhostPeriodeFragment[];
    notCurrent?: boolean;
    person: PersonFragment;
    erSelvstendigNæringsdrivende: boolean;
}

export const Periods = ({
    start,
    end,
    periods,
    infotrygdPeriods = [],
    ghostPeriods = [],
    notCurrent,
    activePeriod,
    person,
    erSelvstendigNæringsdrivende,
}: PeriodsProps): ReactElement => {
    const allPeriods = mergePeriods(periods, infotrygdPeriods, ghostPeriods);
    const validPeriods = filterValidPeriods(allPeriods);
    const populatedPeriods = usePopulateNeighbours(validPeriods);
    const visiblePeriods = useVisiblePeriods(end, start, populatedPeriods);
    const positions = usePeriodStyling(start, end, visiblePeriods);

    return (
        <div className={styles.Periods}>
            {visiblePeriods.map((period, i) => (
                <Period
                    key={i}
                    period={period}
                    style={positions.get(i) ?? {}}
                    notCurrent={notCurrent}
                    isActive={isActive(activePeriod, period)}
                    person={person}
                    erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende}
                />
            ))}
        </div>
    );
};
