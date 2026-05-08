import React, { ReactElement } from 'react';

import { FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';

export function Dokumentvisning(): ReactElement {
    return (
        <VStack
            as="section"
            gap="space-8"
            className="w-120 border-l border-l-ax-border-neutral-subtle [grid-area:høyremeny]"
        >
            <div className="border-b border-b-ax-border-neutral-subtle p-4">
                <Heading level="3" size="xsmall">
                    Dokumentvisning
                </Heading>
            </div>
            <VStack align="center" padding="space-16" className="mt-20 text-center">
                <FileTextIcon fontSize={62} className="text-ax-text-neutral-subtle" />
                <BodyShort weight="semibold">Ingen dokument valgt</BodyShort>
                <BodyShort size="small" className="text-ax-text-neutral-subtle">
                    Klikk på et dokument i meldingstråden for å se forhåndsvisning
                </BodyShort>
            </VStack>
        </VStack>
    );
}
