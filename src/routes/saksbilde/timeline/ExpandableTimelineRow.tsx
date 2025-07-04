import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Arbeidsgivernavn, erSelvstendigNæringsdrivende } from '@components/Arbeidsgivernavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SelvstendigNæringsdrivendeIkon } from '@components/ikoner/SelvstendigNæringsdrivendeIkon';
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
            <div
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                {erSelvstendigNæringsdrivende(arbeidsgiverIdentifikator) ? (
                    <SelvstendigNæringsdrivendeIkon />
                ) : (
                    <Arbeidsgiverikon />
                )}
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
