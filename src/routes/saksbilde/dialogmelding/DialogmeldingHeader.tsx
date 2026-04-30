'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Box, Button } from '@navikt/ds-react';

export function DialogmeldingHeader(): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    return (
        <Box
            paddingInline="space-16"
            paddingBlock="space-8"
            borderWidth="0 0 1 0"
            borderColor="neutral-subtle"
            className="[grid-area:timeline]"
        >
            <Button
                as={Link}
                href={`/person/${personPseudoId}`}
                variant="tertiary"
                size="small"
                icon={<ArrowLeftIcon aria-hidden />}
            >
                Tilbake til behandling av person
            </Button>
        </Box>
    );
}
