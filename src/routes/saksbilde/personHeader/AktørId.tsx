import React from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

interface AktørIdProps {
    aktørId: string;
}

export const AktørId = ({ aktørId }: AktørIdProps) => (
    <HStack gap="space-4">
        <BodyShort data-sensitive>Aktør-ID: {aktørId}</BodyShort>
        <Tooltip content="Kopier aktør-ID" keys={['alt', 'a']}>
            <CopyButton copyText={aktørId} size="xsmall" />
        </Tooltip>
    </HStack>
);
