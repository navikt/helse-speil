import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { SackKronerIcon } from '@navikt/aksel-icons';

import { Arbeidsgivernavn } from '@components/Arbeidsgivernavn';
import { TilkommenInntekt } from '@io/graphql';
import { TilkommenInntektPeriods } from '@saksbilde/timeline/TilkommenInntektPeriods';

import styles from './TilkommenInntektTimelineRow.module.css';

export interface TilkommenInntektTimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    organisasjonsnummer: string;
    tilkomneInntekter: Array<TilkommenInntekt>;
}

export const TilkommenInntektTimelineRow = ({
    start,
    end,
    organisasjonsnummer,
    tilkomneInntekter,
}: TilkommenInntektTimelineRowProps): ReactElement => (
    <div className={styles.TimelineRow}>
        <div className={classNames(styles.Name)}>
            <SackKronerIcon className={styles.arbeidsgiverIkon} />
            <Arbeidsgivernavn identifikator={organisasjonsnummer} maxWidth="225px" showCopyButton />
        </div>

        <div className={styles.Periods}>
            <TilkommenInntektPeriods start={start} end={end} tilkomneInntekter={tilkomneInntekter} />
        </div>
    </div>
);
