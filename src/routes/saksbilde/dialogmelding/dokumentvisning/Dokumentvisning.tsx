import React, { ReactElement } from 'react';

import { Heading, VStack } from '@navikt/ds-react';

export function Dokumentvisning(): ReactElement {
    return (
        <VStack
            as="section"
            gap="space-8"
            className="w-91.5 border-l border-l-ax-border-neutral-subtle [grid-area:høyremeny]"
            padding="space-16"
        >
            <Heading level="3" size="xsmall">
                Dokumentvisning
            </Heading>
        </VStack>
    );
}
