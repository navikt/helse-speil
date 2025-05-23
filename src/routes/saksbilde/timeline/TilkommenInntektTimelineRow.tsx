import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Skeleton } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { TilkommenInntekt } from '@io/graphql';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { TilkommenInntektPeriods } from '@saksbilde/timeline/TilkommenInntektPeriods';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeArbeidsgiver } from '@utils/locale';

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

    const organisasjonNavn =
        organisasjonData?.organisasjon?.navn != undefined
            ? capitalizeArbeidsgiver(organisasjonData.organisasjon.navn)
            : undefined;

    const tooltipText = organisasjonLoading
        ? 'Henter navn fra enhetsregisteret...'
        : organisasjonNavn === undefined
          ? 'En feil oppsto ved henting av navn fra enhetsregisteret'
          : erAnonymisert
            ? 'Arbeidsgiver'
            : organisasjonNavn;

    return (
        <div className={styles.TimelineRow}>
            <ArbeidsgiverikonMedTooltip tooltipTekst={tooltipText} className={classNames(styles.Name)}>
                {organisasjonLoading ? (
                    <Skeleton width="8rem" />
                ) : organisasjonNavn === undefined ? (
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
            </ArbeidsgiverikonMedTooltip>
            <div className={styles.Periods}>
                <TilkommenInntektPeriods start={start} end={end} tilkomneInntekter={tilkomneInntekter} />
            </div>
        </div>
    );
};
