import React, { ReactElement } from 'react';

import { Box, Heading, Skeleton, VStack } from '@navikt/ds-react';

export function DialogmeldingContentSkeleton(): ReactElement {
    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        Dialogmelding
                    </Heading>
                    <Skeleton width={260} />
                </VStack>
                <VStack gap="space-16">
                    <Skeleton height={100} variant="rounded" />
                    <Skeleton height={250} variant="rounded" />
                </VStack>
            </VStack>
        </Box>
    );
}
