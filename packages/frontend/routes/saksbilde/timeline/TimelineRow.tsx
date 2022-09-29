import React from 'react';
import { Bag } from '@navikt/ds-icons';
import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
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

export const TimelineRow: React.VFC<TimelineRowProps> = ({ start, end, name, periods, ghostPeriods, activePeriod }) => (
    <div className={styles.TimelineRow}>
        <Tooltip content={name} maxChar={name.length}>
            <div className={styles.Name}>
                <Bag height={16} width={16} />
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
