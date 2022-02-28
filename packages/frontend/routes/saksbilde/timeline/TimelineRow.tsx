import React from 'react';
import { Bag } from '@navikt/ds-icons';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import type { GhostPeriode, Periode } from '@io/graphql';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

export interface TimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    name: string;
    periods: Array<Periode>;
    infotrygdPeriods?: Array<InfotrygdPeriod>;
    ghostPeriods?: Array<GhostPeriode>;
    activePeriodId?: string | null;
}

export const TimelineRow: React.VFC<TimelineRowProps> = React.memo(
    ({ start, end, name, periods, infotrygdPeriods, ghostPeriods, activePeriodId }) => (
        <div className={styles.TimelineRow}>
            <div className={styles.Name}>
                <Bag height={16} width={16} />
                <AnonymizableTextWithEllipsis size="small" data-tip={name}>
                    {name}
                </AnonymizableTextWithEllipsis>
            </div>
            <div className={styles.Periods}>
                <Periods
                    periods={periods}
                    start={start}
                    end={end}
                    infotrygdPeriods={infotrygdPeriods}
                    ghostPeriods={ghostPeriods}
                />
            </div>
        </div>
    )
);
