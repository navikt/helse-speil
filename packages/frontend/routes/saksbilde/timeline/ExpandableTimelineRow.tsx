import classNames from 'classnames';
import React, { useState } from 'react';

import { Bag } from '@navikt/ds-icons';
import { Tooltip } from '@navikt/ds-react';

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
    ghostPeriods,
    activePeriod,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.TimelineRow}>
            <Tooltip content={name}>
                <button
                    className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                    onClick={() => setIsExpanded((prevState) => !prevState)}
                >
                    <Bag height={16} width={16} />
                    <AnonymizableTextWithEllipsis size="small">{name}</AnonymizableTextWithEllipsis>
                </button>
            </Tooltip>
            <div className={classNames(styles.Periods)}>
                {generations[0] && (
                    <Periods start={start} end={end} periods={generations[0].perioder} activePeriod={activePeriod} />
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
                                ghostPeriods={ghostPeriods}
                                notCurrent
                                activePeriod={activePeriod}
                            />
                        ))}
            </div>
        </div>
    );
};
