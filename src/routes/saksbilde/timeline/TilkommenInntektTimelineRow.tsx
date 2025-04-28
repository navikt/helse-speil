import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { TilkommenInntekt } from '@io/graphql';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { TilkommenInntektPeriods } from '@saksbilde/timeline/TilkommenInntektPeriods';
import { useIsAnonymous } from '@state/anonymization';

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
}: TilkommenInntektTimelineRowProps): ReactElement => {
    const { data: organisasjonQueryData } = useOrganisasjonQuery(organisasjonsnummer);
    const erAnonymisert = useIsAnonymous();

    const organisasjonNavn = organisasjonQueryData?.organisasjon?.navn ?? organisasjonsnummer;

    return (
        <div className={styles.TimelineRow}>
            <Tooltip content={organisasjonNavn && !erAnonymisert ? organisasjonNavn : 'Arbeidsgiver'}>
                <div className={classNames(styles.Name, styles.anonymisert)}>
                    <PlusCircleIcon className={styles.arbeidsgiverIkon} />
                    <AnonymizableTextWithEllipsis>{organisasjonNavn}</AnonymizableTextWithEllipsis>
                    <KopierAgNavn navn={organisasjonNavn} />
                </div>
            </Tooltip>

            <div className={styles.Periods}>
                <TilkommenInntektPeriods start={start} end={end} tilkomneInntekter={tilkomneInntekter} />
            </div>
        </div>
    );
};
