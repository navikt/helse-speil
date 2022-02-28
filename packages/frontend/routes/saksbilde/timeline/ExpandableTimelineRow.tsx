import React, { useState } from 'react';
import classNames from 'classnames';
import { Bag } from '@navikt/ds-icons';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import type { Generasjon, GhostPeriode } from '@io/graphql';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

interface ExpandableTimelineRowProp {
    start: Dayjs;
    end: Dayjs;
    name: string;
    generations: Array<Generasjon>;
    infotrygdPeriods?: Array<InfotrygdPeriod>;
    ghostPeriods?: Array<GhostPeriode>;
}

export const ExpandableTimelineRow: React.VFC<ExpandableTimelineRowProp> = ({
    start,
    end,
    name,
    generations,
    infotrygdPeriods,
    ghostPeriods,
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
                            />
                        ))}
            </div>
        </div>
    );
};
