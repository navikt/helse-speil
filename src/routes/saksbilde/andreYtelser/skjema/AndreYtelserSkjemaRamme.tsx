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
        <Box
            background="neutral-soft"
            marginBlock="space-0 space-16"
            paddingBlock="space-16 space-0"
            width="max-content"
        >
            <VStack>
                <Box
                    background="neutral-soft"
                    height="2.5rem"
                    className="inset-shadow-[3px_0px] inset-shadow-ax-border-accent-strong"
                >
                    <HStack paddingInline="space-32" paddingBlock="space-8 space-16">
                        <Button
                            className="-ml-2.5"
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
                    paddingBlock="space-16 space-20"
                    paddingInline="space-32"
                    width="fit-content"
                    minWidth="460px"
                    className="inset-shadow-[3px_0px] inset-shadow-ax-border-accent-strong"
                >
                    {children}
                </Box>
            </VStack>
        </Box>
    );
}
