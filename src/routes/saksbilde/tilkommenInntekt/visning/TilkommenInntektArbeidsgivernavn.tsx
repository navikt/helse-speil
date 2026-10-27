import React from 'react';

import { SackKronerIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';

export const TilkommenInntektArbeidsgivernavn = ({ organisasjonsnummer }: { organisasjonsnummer: string }) => (
    <HStack align="center" gap="space-4">
        <SackKronerIcon aria-hidden fontSize="1.4rem" />
        <Organisasjonsnavn maxWidth="225px" organisasjonsnummer={organisasjonsnummer} weight="semibold" />
        <HStack>
            <BodyShort weight="semibold">(</BodyShort>
            <BodyShort truncate data-sensitive weight="semibold">
                {organisasjonsnummer}
            </BodyShort>
            <Tooltip content="Kopier virksomhetsnummer">
                <CopyButton copyText={organisasjonsnummer} size="xsmall" onClick={(event) => event.stopPropagation()} />
            </Tooltip>
            <BodyShort weight="semibold">)</BodyShort>
        </HStack>
    </HStack>
);
