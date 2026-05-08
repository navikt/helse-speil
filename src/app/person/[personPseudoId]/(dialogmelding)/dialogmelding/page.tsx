'use client';

import { redirect } from 'next/navigation';
import React, { ReactElement, use } from 'react';

import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';

import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { ApiBehandlerMedDialoger } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingContentSkeleton } from '@saksbilde/dialogmelding/content/DialogmeldingContentSkeleton';

export default function Page({ params }: { params: Promise<{ personPseudoId: string }> }): ReactElement {
    const { personPseudoId } = use(params);
    const { data, isPending } = useGetDialogmeldinger(personPseudoId);

    if (isPending || data === undefined) {
        return <DialogmeldingContentSkeleton />;
    }

    const nyesteDialog = finnNyesteDialog(data);

    if (nyesteDialog) {
        redirect(`/person/${personPseudoId}/dialogmelding/${nyesteDialog.id}`);
    }

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-8">
                <Heading level="2" size="medium">
                    Dialogmelding
                </Heading>
                <BodyShort>Ingen dialoger funnet.</BodyShort>
            </VStack>
        </Box>
    );
}

function finnNyesteDialog(behandlerDialoger: ApiBehandlerMedDialoger[]) {
    return behandlerDialoger.flatMap((b) => b.dialoger).sort((a, b) => b.tid.localeCompare(a.tid))[0] ?? null;
}
