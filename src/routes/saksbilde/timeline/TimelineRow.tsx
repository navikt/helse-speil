import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { Arbeidsgivernavn, erSelvstendigNæringsdrivende } from '@components/Arbeidsgivernavn';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SelvstendigNæringsdrivendeIkon } from '@components/ikoner/SelvstendigNæringsdrivendeIkon';
import { GhostPeriodeFragment, Maybe, PeriodeFragment, PersonFragment } from '@io/graphql';
import { TimelinePeriod } from '@typer/timeline';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

export interface TimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    name: string;
    arbeidsgiverIdentifikator: string;
    periods: Array<PeriodeFragment>;
    activePeriod: Maybe<TimelinePeriod>;
    ghostPeriods?: Array<GhostPeriodeFragment>;
    alignWithExpandable?: boolean;
    person: PersonFragment;
}

export const TimelineRow = ({
    start,
    end,
    name,
    arbeidsgiverIdentifikator,
    periods,
    ghostPeriods,
    activePeriod,
    alignWithExpandable = false,
    person,
}: TimelineRowProps): ReactElement => {
    return (
        <div className={styles.TimelineRow}>
            <div className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}>
                {erSelvstendigNæringsdrivende(arbeidsgiverIdentifikator) ? (
                    <SelvstendigNæringsdrivendeIkon />
                ) : (
                    <Arbeidsgiverikon />
                )}
                <Arbeidsgivernavn
                    identifikator={arbeidsgiverIdentifikator}
                    navn={name}
                    maxWidth="200px"
                    showCopyButton
                />
            </div>
            <div className={styles.Periods}>
                <Periods
                    periods={periods}
                    start={start}
                    end={end}
                    ghostPeriods={ghostPeriods}
                    activePeriod={activePeriod}
                    person={person}
                />
            </div>
        </div>
    );
};

export const TimelineRowSkeleton = (): ReactElement => {
    return (
        <div className={classNames(styles.TimelineRow, styles.TimelineRowSkeleton)}>
            <div className={styles.Name}>
                <LoadingShimmer />
            </div>
            <div className={styles.Periods}>
                <LoadingShimmer />
            </div>
        </div>
    );
};
