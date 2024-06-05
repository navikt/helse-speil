import classNames from 'classnames';
import React from 'react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import type { GhostPeriode, Periode } from '@io/graphql';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

export interface TimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    name: string;
    periods: Array<Periode>;
    activePeriod: TimelinePeriod | null;
    ghostPeriods?: Array<GhostPeriode>;
    alignWithExpandable?: boolean;
}

export const TimelineRow: React.FC<TimelineRowProps> = ({
    start,
    end,
    name,
    periods,
    ghostPeriods,
    activePeriod,
    alignWithExpandable = false,
}) => {
    return (
        <div className={styles.TimelineRow}>
            <ArbeidsgiverikonMedTooltip
                tooltipTekst={name}
                className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}
            >
                <AnonymizableTextWithEllipsis size="small">{name}</AnonymizableTextWithEllipsis>
            </ArbeidsgiverikonMedTooltip>
            <div className={styles.Periods}>
                <Periods
                    periods={periods}
                    start={start}
                    end={end}
                    ghostPeriods={ghostPeriods}
                    activePeriod={activePeriod}
                />
            </div>
        </div>
    );
};

export const TimelineRowSkeleton: React.FC = () => {
    return (
        <div className={classNames(styles.TimelineRow, styles.TimelineRowSkeleton)}>
            <div className={styles.Name}>
                <LoadingShimmer />
            </div>
            <div className={styles.Periods}>
                <LoadingShimmer />
            </div>
        </div>
    );
};
