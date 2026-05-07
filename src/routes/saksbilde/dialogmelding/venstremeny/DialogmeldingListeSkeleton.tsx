import React, { ReactElement } from 'react';

import { Skeleton, VStack } from '@navikt/ds-react';

export function DialogmeldingListeSkeleton(): ReactElement {
    return (
        <VStack gap="space-24">
            <VStack gap="space-8">
                <Skeleton width={160} />
                <VStack gap="space-4">
                    <Skeleton height={48} width="100%" variant="rounded" />
                    <Skeleton height={48} width="100%" variant="rounded" />
                </VStack>
            </VStack>
            <VStack gap="space-8">
                <Skeleton width={140} />
                <Skeleton height={48} width="100%" variant="rounded" />
            </VStack>
            <VStack gap="space-8">
                <Skeleton width={150} />
                <VStack gap="space-4">
                    <Skeleton height={48} width="100%" variant="rounded" />
                    <Skeleton height={48} width="100%" variant="rounded" />
                    <Skeleton height={48} width="100%" variant="rounded" />
                </VStack>
            </VStack>
        </VStack>
    );
}
