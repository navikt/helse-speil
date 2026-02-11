import React, { ReactElement } from 'react';

import { BodyShort, Box, CopyButton, LocalAlert, VStack } from '@navikt/ds-react';

export function historikkFeil(error: Error): ReactElement {
    return (
        <Box padding="space-16" maxWidth="400px">
            <LocalAlert status="error" size="small">
                <LocalAlert.Header>
                    <LocalAlert.Title>Kan ikke vise historikk for perioden.</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                    <VStack gap="space-16">
                        <BodyShort>Feilmelding: {error.message}</BodyShort>
                        {error.stack && (
                            <CopyButton
                                size="small"
                                copyText={error.stack}
                                text="Kopier teknisk feilmelding til utviklere"
                            />
                        )}
                    </VStack>
                </LocalAlert.Content>
            </LocalAlert>
        </Box>
    );
}
