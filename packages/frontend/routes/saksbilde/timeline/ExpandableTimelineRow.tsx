import React, { useState } from 'react';
import classNames from 'classnames';
import { Bag } from '@navikt/ds-icons';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import type { Generasjon } from '@io/graphql';

import { Periods } from './Periods';
import type { TimelineRowProps } from './TimelineRow';

import styles from './TimelineRow.module.css';

interface ExpandableTimelineRowProp extends Omit<TimelineRowProps, 'periods'> {
    generations: Array<Generasjon>;
}

export const ExpandableTimelineRow: React.VFC<ExpandableTimelineRowProp> = ({
    start,
    end,
    name,
    generations,
    infotrygdPeriods,
    ghostPeriods,
    activePeriodId,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.TimelineRow}>
            <button
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                <Bag height={16} width={16} />
                <AnonymizableTextWithEllipsis size="small" data-tip={name}>
                    {name}
                </AnonymizableTextWithEllipsis>
            </button>
            <div className={classNames(styles.Periods)}>
                {generations[0] && (
                    <Periods
                        start={start}
                        end={end}
                        periods={generations[0].perioder}
                        infotrygdPeriods={infotrygdPeriods}
                        activePeriodId={activePeriodId}
                    />
                )}
                {isExpanded &&
                    generations
                        .slice(1)
                        .map((generation, i) => (
                            <Periods
                                key={i}
                                start={start}
                                end={end}
                                periods={generation.perioder}
                                infotrygdPeriods={infotrygdPeriods}
                                ghostPeriods={ghostPeriods}
                                notCurrent
                                activePeriodId={activePeriodId}
                            />
                        ))}
            </div>
        </div>
    );
};
