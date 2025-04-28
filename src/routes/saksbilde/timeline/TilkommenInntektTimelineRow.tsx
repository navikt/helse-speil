import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { TilkommenInntekt } from '@io/graphql';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { TilkommenInntektPeriods } from '@saksbilde/timeline/TilkommenInntektPeriods';
import { useIsAnonymous } from '@state/anonymization';

import styles from './TimelineRow.module.css';

export interface TilkommenInntektTimelineRowProps {
    start: Dayjs;
    end: Dayjs;
    name: string;
    tilkomneInntekter: Array<TilkommenInntekt>;
}

export const TilkommenInntektTimelineRow = ({
    start,
    end,
    name,
    tilkomneInntekter,
}: TilkommenInntektTimelineRowProps): ReactElement => {
    const erAnonymisert = useIsAnonymous();
    return (
        <div className={styles.TimelineRow}>
            <Tooltip content={name && !erAnonymisert ? name : 'Arbeidsgiver'}>
                <div className={classNames(styles.Name, styles.anonymisert)}>
                    <PlusCircleIcon />
                    <AnonymizableTextWithEllipsis>{name}</AnonymizableTextWithEllipsis>
                    <KopierAgNavn navn={name} />
                </div>
            </Tooltip>

            <div className={styles.Periods}>
                <TilkommenInntektPeriods start={start} end={end} tilkomneInntekter={tilkomneInntekter} />
            </div>
        </div>
    );
};
