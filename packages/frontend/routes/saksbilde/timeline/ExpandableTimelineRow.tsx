import classNames from 'classnames';
import React, { useState } from 'react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import type { Generasjon } from '@io/graphql';

import { Periods } from './Periods';
import type { TimelineRowProps } from './TimelineRow';

import styles from './TimelineRow.module.css';

interface ExpandableTimelineRowProp extends Omit<TimelineRowProps, 'periods'> {
    generations: Array<Generasjon>;
}

export const ExpandableTimelineRow: React.FC<ExpandableTimelineRowProp> = ({
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
            <ArbeidsgiverikonMedTooltip
                tooltipTekst={name}
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                <AnonymizableTextWithEllipsis size="small">{name}</AnonymizableTextWithEllipsis>
            </ArbeidsgiverikonMedTooltip>
            <div className={classNames(styles.Periods)}>
                {generations[0] && (
                    <Periods
                        start={start}
                        end={end}
                        periods={generations[0].perioder}
                        ghostPeriods={ghostPeriods}
                        activePeriod={activePeriod}
                        generation={0}
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
                                notCurrent
                                activePeriod={activePeriod}
                                generation={i + 1}
                            />
                        ))}
            </div>
        </div>
    );
};
