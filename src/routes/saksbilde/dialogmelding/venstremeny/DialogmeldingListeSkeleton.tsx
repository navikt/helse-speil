import React, { ReactElement } from 'react';

import { Skeleton, VStack } from '@navikt/ds-react';

export function DialogmeldingListeSkeleton(): ReactElement {
    return (
        <VStack gap="space-4">
            <Skeleton variant="rectangle" height={58} width="100%" />
            <Skeleton variant="rectangle" height={58} width="100%" />
            <Skeleton variant="rectangle" height={58} width="100%" />
            <Skeleton variant="rectangle" height={58} width="100%" />
            <Skeleton variant="rectangle" height={58} width="100%" />
            <Skeleton variant="rectangle" height={58} width="100%" />
        </VStack>
    );
}
