import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { GhostPeriodeFragment, Maybe, PeriodeFragment, PersonFragment } from '@io/graphql';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { TimelinePeriod } from '@typer/timeline';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

export interface TimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    name: string;
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
    periods,
    ghostPeriods,
    activePeriod,
    alignWithExpandable = false,
    person,
}: TimelineRowProps): ReactElement => {
    return (
        <div className={styles.TimelineRow}>
            <ArbeidsgiverikonMedTooltip
                tooltipTekst={name}
                className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}
            >
                <AnonymizableTextWithEllipsis>{name}</AnonymizableTextWithEllipsis>
                <KopierAgNavn navn={name} />
            </ArbeidsgiverikonMedTooltip>
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
