import React, { ReactElement } from 'react';

import { Box, Button, HStack, Heading, Skeleton, VStack } from '@navikt/ds-react';

import { SaksbildemenySkeleton } from '@saksbilde/saksbildeMenu/SaksbildeMenu';

export const PeriodeViewSkeleton = (): ReactElement => (
    <VStack className="h-full min-w-0 flex-1 [grid-area:content]">
        <SaksbildemenySkeleton />
        <Box marginInline="space-16" marginBlock="space-24">
            <HStack gap="space-8" marginBlock="space-0 space-16">
                <Skeleton>
                    <Heading size="small">Dagoversikt Arbeidsgivernavn Gmbh</Heading>
                </Skeleton>
                <Skeleton>
                    <Button size="small">Endre dager</Button>
                </Skeleton>
            </HStack>
            <Skeleton variant="rounded" height={400} />
        </Box>
    </VStack>
);
