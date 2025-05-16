import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { ExclamationmarkTriangleIcon, PlusCircleIcon } from '@navikt/aksel-icons';
import { Skeleton, Tooltip } from '@navikt/ds-react';

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
    const { loading: organisasjonLoading, data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);
    const erAnonymisert = useIsAnonymous();

    const organisasjonNavn = organisasjonData?.organisasjon?.navn;

    const tooltipText = organisasjonLoading
        ? 'Henter navn fra enhetsregisteret...'
        : organisasjonNavn == undefined
          ? 'En feil oppsto ved henting av navn fra enhetsregisteret'
          : erAnonymisert
            ? 'Arbeidsgiver'
            : organisasjonNavn;

    return (
        <div className={styles.TimelineRow}>
            <Tooltip content={tooltipText}>
                <div className={classNames(styles.Name)}>
                    <PlusCircleIcon className={styles.arbeidsgiverIkon} />
                    {organisasjonLoading ? (
                        <Skeleton width="8rem" />
                    ) : organisasjonNavn == undefined ? (
                        <>
                            <AnonymizableTextWithEllipsis>{organisasjonsnummer}</AnonymizableTextWithEllipsis>
                            <ExclamationmarkTriangleIcon color="red" />
                        </>
                    ) : (
                        <>
                            <AnonymizableTextWithEllipsis>{organisasjonNavn}</AnonymizableTextWithEllipsis>
                            <KopierAgNavn navn={organisasjonNavn} />
                        </>
                    )}
                </div>
            </Tooltip>

            <div className={styles.Periods}>
                <TilkommenInntektPeriods start={start} end={end} tilkomneInntekter={tilkomneInntekter} />
            </div>
        </div>
    );
};
