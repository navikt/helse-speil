import React, { ReactElement } from 'react';

import { BodyShort, Button, HStack, InfoCard } from '@navikt/ds-react';

import { cn } from '@utils/tw';

interface FeilmeldingProps {
    errorMessage: string;
    refetch: () => void;
    className?: string;
}

export function ErrorMessageWithRefetch({ errorMessage, refetch, className }: FeilmeldingProps): ReactElement {
    return (
        <InfoCard data-color="danger" className={cn('rounded-none', className)}>
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
