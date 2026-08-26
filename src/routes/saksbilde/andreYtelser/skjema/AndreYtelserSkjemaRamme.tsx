'use client';

import React, { ReactElement, ReactNode } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

interface AndreYtelserSkjemaRammeProps {
    onAvbryt: () => void;
    isPending?: boolean;
    children: ReactNode;
}

/**
 * Gir endre- og gjenopprett-skjemaet samme ramme som tilkommen inntekt:
 * verktøylinje med Avbryt over en boks med accentfarget venstrekant.
 */
export function AndreYtelserSkjemaRamme({
    onAvbryt,
    isPending = false,
    children,
}: AndreYtelserSkjemaRammeProps): ReactElement {
    return (
        <Box marginBlock="space-16" width="max-content">
            <VStack>
                <Box background="neutral-soft" borderWidth="0 0 0 3" borderColor="accent" height="2.5rem">
                    <HStack style={{ paddingLeft: '5px' }} paddingBlock="space-8 space-16">
                        <Button
                            icon={<XMarkIcon />}
                            size="xsmall"
                            variant="tertiary"
                            type="button"
                            onClick={onAvbryt}
                            disabled={isPending}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </Box>
                <Box
                    background="neutral-soft"
                    borderWidth="0 0 0 3"
                    borderColor="accent"
                    paddingBlock="space-16 space-20"
                    paddingInline="space-24"
                    width="fit-content"
                    minWidth="460px"
                >
                    {children}
                </Box>
            </VStack>
        </Box>
    );
}
