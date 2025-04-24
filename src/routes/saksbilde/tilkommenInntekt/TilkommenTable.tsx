import React, { ReactElement } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

export const TilkommenTable = (): ReactElement => (
    <VStack paddingBlock="8 6">
        <Heading size="small" spacing>
            Legg til tilkommen inntekt
        </Heading>
        <Box
            background={'surface-subtle'}
            borderWidth="0 0 0 3"
            style={{ borderColor: 'transparent' }}
            paddingBlock="4"
            paddingInline={'10'}
            minWidth={'390px'}
            maxWidth={'630px'}
        ></Box>
    </VStack>
);
