import React from 'react';

import { Box, BoxProps, HStack, Skeleton } from '@navikt/ds-react';

const SaksbildeMenuWrapper = (props: BoxProps) => (
    <Box
        paddingInline="space-16"
        borderWidth="0 0 1 0"
        borderColor="neutral-subtle"
        height="3rem"
        overflow="hidden"
        {...props}
    />
);

export const SaksbildemenySkeleton = () => (
    <SaksbildeMenuWrapper>
        <HStack gap="space-20" paddingInline="space-20">
            <Skeleton width={100} height={32} />
            <Skeleton width={110} height={32} />
            <Skeleton width={140} height={32} />
            <Skeleton width={90} height={32} />
        </HStack>
    </SaksbildeMenuWrapper>
);
