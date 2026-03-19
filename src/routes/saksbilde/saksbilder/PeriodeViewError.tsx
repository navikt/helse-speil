import NextLink from 'next/link';
import React, { ReactElement } from 'react';

import { Link, VStack } from '@navikt/ds-react';

export function PeriodeViewError(): ReactElement {
    return (
        <VStack gap="space-8" margin="space-24">
            <span>Personen kunne ikke hentes.</span>
            <Link as={NextLink} href="/">
                Klikk her for å gå tilbake til oppgaveoversikten
            </Link>
        </VStack>
    );
}
