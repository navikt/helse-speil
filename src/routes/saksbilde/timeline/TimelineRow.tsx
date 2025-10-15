import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { PersonFragment } from '@io/graphql';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { TimelinePeriod } from '@typer/timeline';
import { isArbeidsgiver, isSelvstendigNaering } from '@utils/typeguards';

import { Periods } from './Periods';

import styles from './TimelineRow.module.css';

export interface TimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    activePeriod: TimelinePeriod | null;
    alignWithExpandable?: boolean;
    person: PersonFragment;
    inntektsforhold: Inntektsforhold;
}

export const TimelineRow = ({
    start,
    end,
    activePeriod,
    alignWithExpandable = false,
    person,
    inntektsforhold,
}: TimelineRowProps): ReactElement => (
    <div className={styles.TimelineRow}>
        <div className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}>
            <Arbeidsgiverikon />
            <Inntektsforholdnavn
                inntektsforholdReferanse={tilReferanse(inntektsforhold)}
                maxWidth="200px"
                showCopyButton
            />
        </div>
        <div className={styles.Periods}>
            <Periods
                periods={inntektsforhold.generasjoner[0]?.perioder ?? []}
                start={start}
                end={end}
                ghostPeriods={isArbeidsgiver(inntektsforhold) ? inntektsforhold.ghostPerioder : []}
                activePeriod={activePeriod}
                person={person}
                erSelvstendigNæringsdrivende={isSelvstendigNaering(inntektsforhold)}
            />
        </div>
    </div>
);

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
