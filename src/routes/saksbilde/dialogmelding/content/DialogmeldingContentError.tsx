import React, { ReactElement } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';

interface DialogmeldingContentFeilProps {
    refetch: () => void;
}

export function DialogmeldingContentError({ refetch }: DialogmeldingContentFeilProps): ReactElement {
    return (
        <Box as="section" padding="space-16" className="min-w-0 [grid-area:content]">
            <VStack gap="space-8" align="start">
                <Heading level="2" size="medium">
                    Dialogmelding
                </Heading>
                <ErrorMessageWithRefetch errorMessage="Kunne ikke hente dialogmelding." refetch={refetch} />
            </VStack>
        </Box>
    );
}
