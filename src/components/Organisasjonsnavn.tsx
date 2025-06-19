import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeArbeidsgiver } from '@utils/locale';

import styles from './Organisasjonsnavn.module.css';

const Organisasjonsnavn = ({
    organisasjonsnummer,
    weight,
    maxWidth,
    showCopyButton,
}: {
    organisasjonsnummer: string;
    weight?: 'regular' | 'semibold';
    maxWidth?: string;
    showCopyButton?: boolean;
}) => {
    const { loading, data } = useOrganisasjonQuery(organisasjonsnummer);
    const navn = data?.organisasjon?.navn ?? undefined;

    return loading ? (
        <Tooltip content="Henter navn fra enhetsregisteret...">
            <Skeleton width="8rem" />
        </Tooltip>
    ) : navn === undefined ? (
        <Tooltip content="Klarte ikke finne ikke navn på organisasjonen i enhetsregisteret">
            <HStack align="center">
                <AnonymizableTextWithEllipsis weight={weight}>{organisasjonsnummer}</AnonymizableTextWithEllipsis>
                <ExclamationmarkTriangleIcon color="red" />
            </HStack>
        </Tooltip>
    ) : (
        <ArbeidsgivernavnKjent navn={navn} weight={weight} maxWidth={maxWidth} showCopyButton={showCopyButton} />
    );
};

export const Arbeidsgivernavn = ({
    identifikator,
    navn,
    weight,
    maxWidth,
    showCopyButton,
}: {
    identifikator: string;
    navn?: string;
    weight?: 'regular' | 'semibold';
    maxWidth?: string;
    showCopyButton?: boolean;
}) => {
    if (identifikator === 'SELVSTENDIG') {
        return <ArbeidsgivernavnKjent navn="Selvstendig næring" weight={weight} maxWidth={maxWidth} />;
    } else if (navn !== undefined && navn !== 'navn er utilgjengelig') {
        return (
            <ArbeidsgivernavnKjent navn={navn} weight={weight} maxWidth={maxWidth} showCopyButton={showCopyButton} />
        );
    }
    return (
        <Organisasjonsnavn
            organisasjonsnummer={identifikator}
            weight={weight}
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
        />
    );
};

const ArbeidsgivernavnKjent = ({
    navn,
    weight,
    maxWidth,
    showCopyButton,
}: {
    navn: string;
    weight?: 'regular' | 'semibold';
    maxWidth?: string;
    showCopyButton?: boolean;
}) => {
    const isAnonymous = useIsAnonymous();
    const navnCapitalized = capitalizeArbeidsgiver(navn);
    return (
        <Tooltip content={isAnonymous ? 'Arbeidsgiver' : navnCapitalized}>
            <HStack gap="2" maxWidth={maxWidth} wrap={false} className={styles.anonymisert}>
                <AnonymizableTextWithEllipsis weight={weight}>{navnCapitalized}</AnonymizableTextWithEllipsis>
                {showCopyButton && <KopierAgNavn navn={navnCapitalized} />}
            </HStack>
        </Tooltip>
    );
};
