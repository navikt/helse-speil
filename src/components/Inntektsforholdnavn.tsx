import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, BodyShortProps, CopyButton, HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { useIsAnonymous } from '@state/anonymization';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { capitalizeName } from '@utils/locale';

import styles from './Inntektsforholdnavn.module.css';

export const Inntektsforholdnavn = ({
    inntektsforholdReferanse,
    maxWidth,
    showCopyButton,
    visOrganisasjonsnummerITooltip = false,
    ...bodyShortProps
}: {
    inntektsforholdReferanse: InntektsforholdReferanse;
    maxWidth?: string;
    showCopyButton?: boolean;
    visOrganisasjonsnummerITooltip?: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    return inntektsforholdReferanse.type === 'Selvstendig Næring' ? (
        <SelvstendigNæringsdrivendeNavn maxWidth={maxWidth} {...bodyShortProps} />
    ) : (
        <Arbeidsgivernavn
            organisasjonsnummer={inntektsforholdReferanse.organisasjonsnummer}
            navn={inntektsforholdReferanse.navn}
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
            visOrganisasjonsnummerITooltip={visOrganisasjonsnummerITooltip}
            {...bodyShortProps}
        />
    );
};

export const Organisasjonsnavn = ({
    organisasjonsnummer,
    maxWidth,
    showCopyButton,
    visOrganisasjonsnummerITooltip = false,
    ...bodyShortProps
}: {
    organisasjonsnummer: string;
    maxWidth?: string;
    showCopyButton?: boolean;
    visOrganisasjonsnummerITooltip?: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    const { isPending: loading, data } = useOrganisasjonQuery(organisasjonsnummer);
    const navn = data?.data?.navn ?? undefined;

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
        <OrganisasonsnavnKjent
            navn={capitalizeArbeidsgiver(navn)}
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
            organisasjonsnummer={organisasjonsnummer}
            visOrganisasjonsnummerITooltip={visOrganisasjonsnummerITooltip}
            {...bodyShortProps}
        />
    );
};

const Arbeidsgivernavn = ({
    organisasjonsnummer,
    navn,
    maxWidth,
    showCopyButton,
    visOrganisasjonsnummerITooltip = false,
    ...bodyShortProps
}: {
    organisasjonsnummer: string;
    navn?: string;
    maxWidth?: string;
    showCopyButton?: boolean;
    visOrganisasjonsnummerITooltip?: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    if (
        navn !== undefined &&
        navn.toLowerCase() !== 'navn er utilgjengelig' &&
        navn.toLowerCase() !== 'ikke tilgjengelig'
    ) {
        return (
            <OrganisasonsnavnKjent
                navn={capitalizeArbeidsgiver(navn)}
                maxWidth={maxWidth}
                showCopyButton={showCopyButton}
                organisasjonsnummer={organisasjonsnummer}
                visOrganisasjonsnummerITooltip={visOrganisasjonsnummerITooltip}
                {...bodyShortProps}
            />
        );
    }
    return (
        <Organisasjonsnavn
            maxWidth={maxWidth}
            showCopyButton={showCopyButton}
            organisasjonsnummer={organisasjonsnummer}
            visOrganisasjonsnummerITooltip={visOrganisasjonsnummerITooltip}
            {...bodyShortProps}
        />
    );
};

function tooltipInnhold(
    isAnonymous: boolean,
    navn: string,
    organisasjonsnummer: string,
    visOrganisasjonsnummerITooltip: boolean,
) {
    if (isAnonymous) {
        return 'Arbeidsgiver';
    } else if (visOrganisasjonsnummerITooltip) {
        return `${navn} (${organisasjonsnummer})`;
    } else {
        return navn;
    }
}

const OrganisasonsnavnKjent = ({
    navn,
    maxWidth,
    showCopyButton,
    organisasjonsnummer,
    visOrganisasjonsnummerITooltip,
    ...bodyShortProps
}: {
    navn: string;
    maxWidth?: string;
    showCopyButton?: boolean;
    organisasjonsnummer: string;
    visOrganisasjonsnummerITooltip: boolean;
} & Omit<BodyShortProps, 'children'>) => {
    const isAnonymous = useIsAnonymous();
    return (
        <Tooltip content={tooltipInnhold(isAnonymous, navn, organisasjonsnummer, visOrganisasjonsnummerITooltip)}>
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

const SelvstendigNæringsdrivendeNavn = ({
    maxWidth,
    ...bodyShortProps
}: {
    maxWidth?: string;
} & Omit<BodyShortProps, 'children'>) => (
    <HStack maxWidth={maxWidth}>
        <BodyShort {...bodyShortProps}>Selvstendig næring</BodyShort>
    </HStack>
);

export const capitalizeArbeidsgiver = (value: string) =>
    capitalizeName(value)
        .replace(/\b(?:As|Asa|Sa|Da|Ba|Se|Fkf|Iks|Kf|Sf|Nuf)\b/, (t) => t.toUpperCase())
        .replaceAll(/\b(?:Og|I)\b/g, (t) => t.toLowerCase());
