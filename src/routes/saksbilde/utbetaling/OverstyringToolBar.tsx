import { ReactElement, ReactNode } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Heading } from '@navikt/ds-react';

interface OverstyringToolBarProps {
    tittel: string;
    avbryt: () => void;
    children?: ReactNode;
}

export function OverstyringToolBar({ tittel, avbryt, children }: OverstyringToolBarProps): ReactElement {
    return (
        <Box marginInline="space-24">
            <HStack paddingBlock="space-0 space-16" gap="space-8">
                <Heading size="xsmall">{tittel}</Heading>
                <Button size="xsmall" variant="tertiary" icon={<XMarkIcon aria-hidden />} onClick={avbryt}>
                    Avbryt
                </Button>
            </HStack>
            {children}
        </Box>
    );
}
