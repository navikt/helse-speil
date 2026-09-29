import React, { ReactElement } from 'react';

import { Skeleton, VStack } from '@navikt/ds-react';

export function DialogmeldingListeSkeleton(): ReactElement {
    return (
        <VStack gap="space-4">
            {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} variant="rectangle" height={100} width="100%" />
            ))}
        </VStack>
    );
}
