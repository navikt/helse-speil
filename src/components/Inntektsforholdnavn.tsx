import React from 'react';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyShort, BodyShortProps, CopyButton, HStack, Skeleton, Tooltip } from '@navikt/ds-react';

import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { capitalizeName } from '@utils/locale';

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
    const navn = data?.navn ?? undefined;

    return loading ? (
        <Tooltip content="Henter navn fra enhetsregisteret...">
            <Skeleton width="8rem" />
        </Tooltip>
    ) : navn === undefined ? (
        <Tooltip content="Klarte ikke finne navn på organisasjonen i enhetsregisteret">
            <HStack align="center">
                <BodyShort truncate data-sensitive {...bodyShortProps}>
                    {organisasjonsnummer}
                </BodyShort>
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
} & Omit<BodyShortProps, 'children'>) => (
    <HStack gap="space-8" maxWidth={maxWidth} wrap={false}>
        <Tooltip content={visOrganisasjonsnummerITooltip ? `${navn} (${organisasjonsnummer})` : navn}>
            <BodyShort truncate data-sensitive {...bodyShortProps}>
                {navn}
            </BodyShort>
        </Tooltip>
        {showCopyButton && (
            <CopyButton
                copyText={navn}
                size="xsmall"
                title="Kopier arbeidsgivernavn"
                onClick={(event) => event.stopPropagation()}
            />
        )}
    </HStack>
);

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

export const useSlåOppNavnOmNødvendig = (organisasjonsnummer?: string, kjentNavn?: string) => {
    const måSlåOppNavn =
        kjentNavn === undefined ||
        kjentNavn.toLowerCase() === 'navn er utilgjengelig' ||
        kjentNavn.toLowerCase() === 'ikke tilgjengelig';

    const { isEnabled, isPending, data } = useOrganisasjonQuery(måSlåOppNavn ? organisasjonsnummer : undefined);

    if (!måSlåOppNavn) {
        return { henterNavn: false, navn: kjentNavn };
    }

    return {
        henterNavn: isEnabled && isPending,
        navn: data?.navn != undefined ? capitalizeArbeidsgiver(data.navn) : 'Navn er utilgjengelig',
    };
};
