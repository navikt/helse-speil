import React from 'react';

import { SackKronerIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, HStack } from '@navikt/ds-react';

import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';

export const TilkommenInntektArbeidsgivernavn = ({ organisasjonsnummer }: { organisasjonsnummer: string }) => (
    <HStack align="center" gap="space-4">
        <SackKronerIcon fontSize="1.4rem" />
        <Organisasjonsnavn maxWidth="225px" organisasjonsnummer={organisasjonsnummer} weight="semibold" />
        <HStack>
            <BodyShort weight="semibold">(</BodyShort>
            <BodyShort truncate data-sensitive weight="semibold">
                {organisasjonsnummer}
            </BodyShort>
            <CopyButton
                copyText={organisasjonsnummer}
                size="xsmall"
                title="Kopier virksomhetsnummer"
                onClick={(event) => event.stopPropagation()}
            />
            <BodyShort weight="semibold">)</BodyShort>
        </HStack>
    </HStack>
);
