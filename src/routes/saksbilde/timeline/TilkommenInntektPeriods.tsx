import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { TilkommenInntekt } from '@io/graphql';
import { TilkommenInntektPeriod } from '@saksbilde/timeline/TilkommenInntektPeriod';
import { usePeriodStyling } from '@saksbilde/timeline/hooks/usePeriodStyling';
import { usePopulateNeighbours } from '@saksbilde/timeline/hooks/usePopulateNeighbours';

import styles from './Periods.module.css';

interface PeriodsProps {
    start: Dayjs;
    end: Dayjs;
    tilkomneInntekter: TilkommenInntekt[];
}

export const TilkommenInntektPeriods = ({ start, end, tilkomneInntekter }: PeriodsProps): ReactElement => {
    const visibleTilkomneInntekter = tilkomneInntekter
        .filter((it) => end.isSameOrAfter(it.periode.fom) && start.isSameOrBefore(it.periode.tom))
        .sort((a, b) => b.periode.fom.localeCompare(a.periode.fom));
    const positions = usePeriodStyling(
        start,
        end,
        usePopulateNeighbours(visibleTilkomneInntekter.map((it) => it.periode)),
    );

    return (
        <div className={styles.Periods}>
            {visibleTilkomneInntekter.map((tilkommenInntekt, i) => (
                <TilkommenInntektPeriod key={i} tilkommenInntekt={tilkommenInntekt} style={positions.get(i) ?? {}} />
            ))}
        </div>
    );
};
