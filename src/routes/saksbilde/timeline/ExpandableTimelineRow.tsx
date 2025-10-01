import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Arbeidsgivernavn, erSelvstendigNæringsdrivende } from '@components/Arbeidsgivernavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { PersonFragment } from '@io/graphql';
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
    arbeidsgiverIdentifikator,
    generations,
    ghostPeriods,
    activePeriod,
    person,
}: ExpandableTimelineRowProp): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.TimelineRow}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
            <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`periods-${arbeidsgiverIdentifikator}`}
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                <Arbeidsgiverikon />
                <Arbeidsgivernavn
                    identifikator={arbeidsgiverIdentifikator}
                    navn={name}
                    showCopyButton
                    maxWidth="200px"
                />
            </div>
            <div className={classNames(styles.Periods)}>
                {generations[0] && (
                    <Periods
                        start={start}
                        end={end}
                        periods={generations[0]?.perioder}
                        ghostPeriods={ghostPeriods}
                        activePeriod={activePeriod}
                        person={person}
                        erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende(arbeidsgiverIdentifikator)}
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
                                erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende(arbeidsgiverIdentifikator)}
                            />
                        ))}
            </div>
        </div>
    );
};
