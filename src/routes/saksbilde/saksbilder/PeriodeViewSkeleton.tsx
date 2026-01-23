import React, { ReactElement } from 'react';

import { Box, Button, HStack, Heading, Skeleton } from '@navikt/ds-react';

import { SaksbildemenySkeleton } from '@saksbilde/saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

export const PeriodeViewSkeleton = (): ReactElement => (
    <div className={styles.Content}>
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
    </div>
);
