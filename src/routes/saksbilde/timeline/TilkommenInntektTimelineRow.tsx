import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { SackKronerIcon } from '@navikt/aksel-icons';

import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektPeriods } from '@saksbilde/timeline/TilkommenInntektPeriods';

import styles from './TimelineRow.module.css';

export interface TilkommenInntektTimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    organisasjonsnummer: string;
    tilkomneInntekter: ApiTilkommenInntekt[];
    alignWithExpandable?: boolean;
}

export const TilkommenInntektTimelineRow = ({
    start,
    end,
    organisasjonsnummer,
    tilkomneInntekter,
    alignWithExpandable = false,
}: TilkommenInntektTimelineRowProps): ReactElement => (
    <div className={styles.TimelineRow}>
        <div className={classNames(styles.Name, alignWithExpandable && styles.AlignWithExpandable)}>
            <SackKronerIcon className={styles.arbeidsgiverIkon} />
            <Organisasjonsnavn organisasjonsnummer={organisasjonsnummer} maxWidth="200px" showCopyButton />
        </div>

        <div className={styles.Periods}>
            <TilkommenInntektPeriods start={start} end={end} tilkomneInntekter={tilkomneInntekter} />
        </div>
    </div>
);
