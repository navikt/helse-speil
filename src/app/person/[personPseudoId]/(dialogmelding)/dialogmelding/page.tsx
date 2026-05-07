'use client';

import { redirect, useParams } from 'next/navigation';

import { BodyShort, Box } from '@navikt/ds-react';

import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { finnNyesteDialog } from '@saksbilde/dialogmelding/testdata';

export default function Page() {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isPending } = useGetDialogmeldinger(personPseudoId);

    if (isPending || data === undefined) {
        return <div>skeleton</div>;
    }

    const nyesteDialog = finnNyesteDialog(data);

    if (nyesteDialog) {
        redirect(`/person/${personPseudoId}/dialogmelding/${nyesteDialog.id}`);
    }

    return (
        <Box as="section" padding="space-16" className="[grid-area:content]">
            <BodyShort className="text-(--ax-text-subtle)">Ingen dialoger funnet.</BodyShort>
        </Box>
    );
}
