import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Generasjon, PersonFragment } from '@io/graphql';
import { Inntektsforhold, inntektsforholdReferanseTilKey, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { isArbeidsgiver, isSelvstendigNaering } from '@utils/typeguards';

import { Periods } from './Periods';
import type { TimelineRowProps } from './TimelineRow';

import styles from './TimelineRow.module.css';

interface ExpandableTimelineRowProp extends Omit<TimelineRowProps, 'periods'> {
    generations: Generasjon[];
    person: PersonFragment;
    inntektsforhold: Inntektsforhold;
}

export const ExpandableTimelineRow = ({
    start,
    end,
    generations,
    activePeriod,
    person,
    inntektsforhold,
}: ExpandableTimelineRowProp): ReactElement => {
    const [isExpanded, setIsExpanded] = useState(false);
    const inntektsforholdReferanse = tilReferanse(inntektsforhold);
    return (
        <div className={styles.TimelineRow}>
            <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`periods-${inntektsforholdReferanseTilKey(inntektsforholdReferanse)}`}
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                <Arbeidsgiverikon />
                <Inntektsforholdnavn
                    inntektsforholdReferanse={inntektsforholdReferanse}
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
                        ghostPeriods={isArbeidsgiver(inntektsforhold) ? inntektsforhold.ghostPerioder : []}
                        activePeriod={activePeriod}
                        person={person}
                        erSelvstendigNæringsdrivende={isSelvstendigNaering(inntektsforhold)}
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
                                erSelvstendigNæringsdrivende={isSelvstendigNaering(inntektsforhold)}
                            />
                        ))}
            </div>
        </div>
    );
};
