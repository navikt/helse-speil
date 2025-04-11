import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { PersonFragment } from '@io/graphql';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { ArbeidsgiverGenerasjon } from '@typer/shared';

import { Periods } from './Periods';
import type { TimelineRowProps } from './TimelineRow';

import styles from './TimelineRow.module.css';

interface ExpandableTimelineRowProp extends Omit<TimelineRowProps, 'periods'> {
    generations: Array<ArbeidsgiverGenerasjon>;
    person: PersonFragment;
}

export const ExpandableTimelineRow = ({
    start,
    end,
    name,
    generations,
    ghostPeriods,
    nyeInntektsforholdPeriods,
    activePeriod,
    person,
}: ExpandableTimelineRowProp): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.TimelineRow}>
            <ArbeidsgiverikonMedTooltip
                tooltipTekst={name}
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                <AnonymizableTextWithEllipsis>{name}</AnonymizableTextWithEllipsis>
                <KopierAgNavn navn={name} />
            </ArbeidsgiverikonMedTooltip>
            <div className={classNames(styles.Periods)}>
                {generations[0] && (
                    <Periods
                        start={start}
                        end={end}
                        periods={generations[0]?.perioder}
                        ghostPeriods={ghostPeriods}
                        nyeInntektsforholdPeriods={nyeInntektsforholdPeriods}
                        activePeriod={activePeriod}
                        person={person}
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
                                person={person}
                            />
                        ))}
            </div>
        </div>
    );
};
