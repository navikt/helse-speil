import React from 'react';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, ErrorMessage, HStack, Skeleton } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';

interface Props {
    organisasjonsnummer: string;
    organisasjonLoading: boolean;
    organisasjonsnavn?: string;
}

export const TilkommenInntektArbeidsgivernavn = ({
    organisasjonsnummer,
    organisasjonLoading,
    organisasjonsnavn,
}: Props) => (
    <HStack align="center" gap="2">
        <PlusCircleIcon fontSize="1.3rem" />
        {organisasjonLoading ? (
            <Skeleton width="8rem" />
        ) : organisasjonsnavn === undefined ? (
            <ErrorMessage>Feil ved navnoppslag</ErrorMessage>
        ) : (
            <AnonymizableTextWithEllipsis weight="semibold">{organisasjonsnavn}</AnonymizableTextWithEllipsis>
        )}
        <HStack>
            <BodyShort weight="semibold">(</BodyShort>
            <AnonymizableTextWithEllipsis weight="semibold">{organisasjonsnummer}</AnonymizableTextWithEllipsis>
            <CopyButton
                copyText={organisasjonsnummer}
                size="xsmall"
                title="Kopier organisasjonsnummer"
                onClick={(event) => event.stopPropagation()}
            />
            <BodyShort weight="semibold">)</BodyShort>
        </HStack>
    </HStack>
);
