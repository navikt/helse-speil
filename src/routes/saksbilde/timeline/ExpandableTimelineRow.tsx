import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Arbeidsgivernavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Generasjon, PersonFragment } from '@io/graphql';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
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
    const arbeidsgiverfelt = isArbeidsgiver(inntektsforhold)
        ? {
              identifikator: inntektsforhold.organisasjonsnummer,
              navn: inntektsforhold.navn,
              ghostPerioder: inntektsforhold.ghostPerioder,
          }
        : { identifikator: 'SELVSTENDIG', navn: 'SELVSTENDIG', ghostPerioder: [] };
    return (
        <div className={styles.TimelineRow}>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
            <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`periods-${arbeidsgiverfelt.identifikator}`}
                className={classNames(styles.Name, styles.Expandable, isExpanded && styles.expanded)}
                onClick={() => setIsExpanded((prevState) => !prevState)}
            >
                <Arbeidsgiverikon />
                <Arbeidsgivernavn
                    identifikator={arbeidsgiverfelt.identifikator}
                    navn={arbeidsgiverfelt.navn}
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
                        ghostPeriods={arbeidsgiverfelt.ghostPerioder}
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
