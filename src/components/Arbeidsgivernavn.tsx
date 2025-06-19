import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { KopierAgNavn } from '@saksbilde/timeline/KopierAgNavn';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeArbeidsgiver } from '@utils/locale';

import styles from './Arbeidsgivernavn.module.css';

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
            <ArbeidsgivernavnKjent
                navn={capitalizeArbeidsgiver(navn)}
                weight={weight}
                maxWidth={maxWidth}
                showCopyButton={showCopyButton}
            />
        );
    }
    return (
        <ArbeidsgivernavnOppslag
            organisasjonsnummer={identifikator}
            weight={weight}
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
        />
    );
};

const ArbeidsgivernavnOppslag = ({
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
        <ArbeidsgivernavnKjent
            navn={capitalizeArbeidsgiver(navn)}
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
    return (
        <Tooltip content={isAnonymous ? 'Arbeidsgiver' : navn}>
            <HStack gap="2" maxWidth={maxWidth} wrap={false} className={styles.anonymisert}>
                <AnonymizableTextWithEllipsis weight={weight}>{navn}</AnonymizableTextWithEllipsis>
                {showCopyButton && <KopierAgNavn navn={navn} />}
            </HStack>
        </Tooltip>
    );
};
