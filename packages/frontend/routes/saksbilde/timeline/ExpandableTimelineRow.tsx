import classNames from 'classnames';
import React, { useState } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
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
            <Tooltip content={name} maxChar={name.length}>
                <button
                    className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                    onClick={() => setIsExpanded((prevState) => !prevState)}
                >
                    <Arbeidsgiverikon alt="Arbeidsgiver" />
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
