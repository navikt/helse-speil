import { Dayjs } from 'dayjs';
import React, { ReactElement, useMemo } from 'react';

import { TilkommenInntekt } from '@io/graphql';
import { TilkommenInntektPeriod } from '@saksbilde/timeline/TilkommenInntektPeriod';
import { useTilkommenInntektPeriodStyling } from '@saksbilde/timeline/hooks/useTilkommenInntektPeriodStyling';

import styles from './Periods.module.css';

const useVisiblePeriods = (end: Dayjs, start: Dayjs, periods: Array<TilkommenInntekt>): Array<TilkommenInntekt> =>
    useMemo(
        () => periods.filter((it) => end.isSameOrAfter(it.periode.fom) && start.isSameOrBefore(it.periode.tom)),
        [end, start, periods],
    );

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    tilkomneInntekter: Array<TilkommenInntekt>;
}

export const TilkommenInntektPeriods = ({ start, end, tilkomneInntekter }: PeriodsProps): ReactElement => {
    const visiblePeriods = useVisiblePeriods(end, start, tilkomneInntekter);
    const positions = useTilkommenInntektPeriodStyling(start, end, visiblePeriods);

    return (
        <div className={styles.Periods}>
            {visiblePeriods.map((period, i) => (
                <TilkommenInntektPeriod key={i} tilkommenInntekt={period} style={positions.get(i) ?? {}} />
            ))}
        </div>
    );
};
