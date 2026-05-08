import React, { ReactElement } from 'react';

import { Heading, VStack } from '@navikt/ds-react';

export function Dokumentvisning(): ReactElement {
    return (
        <VStack as="section" className="w-91.5 border-l border-l-ax-border-neutral-subtle p-4 [grid-area:høyremeny]">
            <Heading level="3" size="xsmall">
                Dokumentvisning
            </Heading>
        </VStack>
    );
}
