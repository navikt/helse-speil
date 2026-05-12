import React, { ReactElement } from 'react';

import { Box, HStack, Skeleton, VStack } from '@navikt/ds-react';

export function DialogmeldingContentSkeleton(): ReactElement {
    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Skeleton width={300} height={28} />
                    <HStack gap="space-8">
                        <Skeleton width={140} />
                        <Skeleton width={120} />
                        <Skeleton width={130} />
                        <Skeleton width={150} />
                        <Skeleton width={130} />
                        <Skeleton width={140} />
                    </HStack>
                </VStack>
                <VStack gap="space-16">
                    <Skeleton height={100} variant="rounded" />
                    <Skeleton height={250} variant="rounded" />
                </VStack>
            </VStack>
        </Box>
    );
}
