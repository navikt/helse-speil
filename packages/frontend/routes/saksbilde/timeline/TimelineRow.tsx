import classNames from 'classnames';
import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
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
}

export const TimelineRow: React.FC<TimelineRowProps> = ({ start, end, name, periods, ghostPeriods, activePeriod }) => (
    <div className={styles.TimelineRow}>
        <Tooltip content={name} maxChar={name.length}>
            <div className={styles.Name}>
                <Arbeidsgiverikon alt="Arbeidsgiver" />
                <AnonymizableTextWithEllipsis size="small">{name}</AnonymizableTextWithEllipsis>
            </div>
        </Tooltip>
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
