import React from 'react';

import { CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';

interface AktørIdProps {
    aktørId: string;
}

export const AktørId = ({ aktørId }: AktørIdProps) => (
    <HStack gap="space-4">
        <AnonymizableText>Aktør-ID: {aktørId}</AnonymizableText>
        <Tooltip content="Kopier aktør-ID">
            <CopyButton copyText={aktørId} size="xsmall" />
        </Tooltip>
    </HStack>
);
