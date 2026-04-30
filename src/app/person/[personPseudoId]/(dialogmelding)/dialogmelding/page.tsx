'use client';

import { redirect, useParams } from 'next/navigation';

import { BodyShort, Box } from '@navikt/ds-react';

import { finnNyesteDialog, testBehandlere } from '@saksbilde/dialogmelding/testdata';

export default function Page() {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const nyesteDialog = finnNyesteDialog(testBehandlere);

    if (nyesteDialog) {
        redirect(`/person/${personPseudoId}/dialogmelding/${nyesteDialog.id}`);
    }

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <BodyShort className="text-(--ax-text-subtle)">Ingen dialoger funnet.</BodyShort>
        </Box>
    );
}
