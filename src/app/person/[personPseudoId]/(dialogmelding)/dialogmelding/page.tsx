'use client';

import { redirect } from 'next/navigation';
import React, { ReactElement, use } from 'react';

import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';

import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { ApiDialogOppsummering } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingContentSkeleton } from '@saksbilde/dialogmelding/content/DialogmeldingContentSkeleton';

export default function Page({ params }: { params: Promise<{ personPseudoId: string }> }): ReactElement {
    const { personPseudoId } = use(params);
    const { data, isPending } = useGetDialogmeldinger(personPseudoId);

    if (isPending || data === undefined) {
        return <DialogmeldingContentSkeleton />;
    }

    const nyesteDialog = finnNyesteDialog(data);

    if (nyesteDialog) {
        redirect(`/person/${personPseudoId}/dialogmelding/${nyesteDialog.conversationRef}`);
    }

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <VStack gap="space-8">
                <Heading level="2" size="medium">
                    Dialogmelding
                </Heading>
                <BodyShort>Ingen dialog funnet.</BodyShort>
            </VStack>
        </Box>
    );
}

function finnNyesteDialog(dialoger: ApiDialogOppsummering[]) {
    return dialoger.toSorted((a, b) => b.sisteAktivitetTidspunkt.localeCompare(a.sisteAktivitetTidspunkt))[0] ?? null;
}
