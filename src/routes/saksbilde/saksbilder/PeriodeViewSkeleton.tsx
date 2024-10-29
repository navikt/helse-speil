import React, { ReactElement } from 'react';

import { Box, Button, HStack, Heading, Skeleton } from '@navikt/ds-react';

import { SaksbildemenySkeleton } from '@saksbilde/saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

export const PeriodeViewSkeleton = (): ReactElement => (
    <div className={styles.Content}>
        <SaksbildemenySkeleton />
        <Box marginInline="4" marginBlock="6">
            <HStack gap="2" marginBlock="0 4">
                <Skeleton>
                    <Heading size="small">Dagoversikt Arbeidsgivernavn Gmbh</Heading>
                </Skeleton>
                <Skeleton>
                    <Button size="small">Overstyr dager</Button>
                </Skeleton>
            </HStack>
            <Skeleton variant="rounded" height={400} />
        </Box>
    </div>
);
