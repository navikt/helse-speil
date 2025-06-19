import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShortProps, CopyButton, HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { useIsAnonymous } from '@state/anonymization';
import { capitalizeName } from '@utils/locale';

import styles from './Arbeidsgivernavn.module.css';

export const Arbeidsgivernavn = ({
    identifikator,
    navn,
    maxWidth,
    showCopyButton,
    ...bodyShortProps
}: {
    identifikator: string;
    navn?: string;
    maxWidth?: string;
    showCopyButton?: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    if (erSelvstendigNæringsdrivende(identifikator)) {
        return <ArbeidsgivernavnKjent navn="Selvstendig næring" maxWidth={maxWidth} {...bodyShortProps} />;
    } else if (
        navn !== undefined &&
        navn.toLowerCase() !== 'navn er utilgjengelig' &&
        navn.toLowerCase() !== 'ikke tilgjengelig'
    ) {
        return (
            <ArbeidsgivernavnKjent
                navn={capitalizeArbeidsgiver(navn)}
                maxWidth={maxWidth}
                showCopyButton={showCopyButton}
                {...bodyShortProps}
            />
        );
    }
    return (
        <ArbeidsgivernavnOppslag
            organisasjonsnummer={identifikator}
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
            {...bodyShortProps}
        />
    );
};

const ArbeidsgivernavnOppslag = ({
    organisasjonsnummer,
    maxWidth,
    showCopyButton,
    ...bodyShortProps
}: {
    organisasjonsnummer: string;
    maxWidth?: string;
    showCopyButton?: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    const { loading, data } = useOrganisasjonQuery(organisasjonsnummer);
    const navn = data?.organisasjon?.navn ?? undefined;

    return loading ? (
        <Tooltip content="Henter navn fra enhetsregisteret...">
            <Skeleton width="8rem" />
        </Tooltip>
    ) : navn === undefined ? (
        <Tooltip content="Klarte ikke finne ikke navn på organisasjonen i enhetsregisteret">
            <HStack align="center">
                <AnonymizableTextWithEllipsis {...bodyShortProps}>{organisasjonsnummer}</AnonymizableTextWithEllipsis>
                <ExclamationmarkTriangleIcon color="red" />
            </HStack>
        </Tooltip>
    ) : (
        <ArbeidsgivernavnKjent
            navn={capitalizeArbeidsgiver(navn)}
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
            {...bodyShortProps}
        />
    );
};

const ArbeidsgivernavnKjent = ({
    navn,
    maxWidth,
    showCopyButton,
    ...bodyShortProps
}: {
    navn: string;
    maxWidth?: string;
    showCopyButton?: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    const isAnonymous = useIsAnonymous();
    return (
        <Tooltip content={isAnonymous ? 'Arbeidsgiver' : navn}>
            <HStack gap="2" maxWidth={maxWidth} wrap={false} className={styles.anonymisert}>
                <AnonymizableTextWithEllipsis {...bodyShortProps}>{navn}</AnonymizableTextWithEllipsis>
                {showCopyButton && (
                    <CopyButton
                        copyText={navn}
                        size="xsmall"
                        title="Kopier arbeidsgivernavn"
                        onClick={(event) => event.stopPropagation()}
                    />
                )}
            </HStack>
        </Tooltip>
    );
};

export const erSelvstendigNæringsdrivende = (identifikator: string) => identifikator === 'SELVSTENDIG';

export const capitalizeArbeidsgiver = (value: string) =>
    capitalizeName(value)
        .replace(/\b(?:As|Asa|Sa|Da|Ba|Se|Fkf|Iks|Kf|Sf|Nuf)\b/, (t) => t.toUpperCase())
        .replaceAll(/\b(?:Og|I)\b/g, (t) => t.toLowerCase());
