'use client';

import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { Box, Heading, VStack } from '@navikt/ds-react';

import { useGetDialogmelding } from '@io/rest/generated/default/default';

import { DialogmeldingContentError } from './DialogmeldingContentError';
import { DialogmeldingContentSkeleton } from './DialogmeldingContentSkeleton';
import { DialogmeldingKort } from './DialogmeldingKort';
import { SvarPåDialogForm } from './SvarPåDialogForm';

export function DialogmeldingContent(): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId: string }>();
    const { data, isPending, isError, refetch } = useGetDialogmelding(personPseudoId, dialogId, {
        query: { gcTime: 2 * 60 * 1000 },
    });

    if (isPending) {
        return <DialogmeldingContentSkeleton />;
    }

    if (isError || data === undefined) {
        return <DialogmeldingContentError refetch={refetch} />;
    }

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-16">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        Dialogmelding
                    </Heading>
                    <Heading level="3" size="xsmall">
                        {data.tittel}
                    </Heading>
                </VStack>
                <VStack gap="space-16">
                    {data.dialogmeldinger.map((melding, index) => (
                        <DialogmeldingKort key={index} melding={melding} />
                    ))}
                </VStack>
                <SvarPåDialogForm />
            </VStack>
        </Box>
    );
}
