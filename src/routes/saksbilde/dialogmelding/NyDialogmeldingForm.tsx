'use client';

import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, Box, Button, HStack, Heading } from '@navikt/ds-react';

export function NyDialogmeldingForm(): ReactElement {
    const router = useRouter();
    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <HStack justify="space-between" align="center">
                <Heading level="2" size="medium">
                    Ny dialogmelding
                </Heading>
                <Button variant="tertiary" size="small" onClick={() => router.back()}>
                    Avbryt
                </Button>
            </HStack>
            <BodyShort>form her</BodyShort>
        </Box>
    );
}
