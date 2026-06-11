import React, { ReactElement } from 'react';

import { BodyShort, Button, HStack, InfoCard } from '@navikt/ds-react';

interface FeilmeldingProps {
    errorMessage: string;
    refetch: () => void;
}

export function ErrorMessageWithRefetch({ errorMessage, refetch }: FeilmeldingProps): ReactElement {
    return (
        <InfoCard data-color="danger" className="rounded-none">
            <InfoCard.Header>
                <HStack gap="space-8" className="p-1">
                    <BodyShort>{errorMessage}</BodyShort>
                    <Button type="button" size="xsmall" onClick={() => refetch()}>
                        Prøv igjen
                    </Button>
                </HStack>
            </InfoCard.Header>
        </InfoCard>
    );
}
