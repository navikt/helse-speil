import React from 'react';

import { SackKronerIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, HStack } from '@navikt/ds-react';

import { Organisasjonsnavn } from '@components/Organisasjonsnavn';
import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';

export const TilkommenInntektArbeidsgivernavn = ({ organisasjonsnummer }: { organisasjonsnummer: string }) => (
    <HStack align="center" gap="1">
        <SackKronerIcon fontSize="1.4rem" />
        <Organisasjonsnavn organisasjonsnummer={organisasjonsnummer} weight="semibold" />
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
