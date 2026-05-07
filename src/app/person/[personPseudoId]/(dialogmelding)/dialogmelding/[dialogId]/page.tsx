'use client';

import { notFound } from 'next/navigation';
import React, { ReactElement, use } from 'react';

import { useGetDialogmelding } from '@io/rest/generated/default/default';
import { DialogmeldingContent } from '@saksbilde/dialogmelding/DialogmeldingContent';

type DialogPageProps = {
    params: Promise<{ personPseudoId: string; dialogId: string }>;
};

export default function Page({ params }: DialogPageProps): ReactElement {
    const { personPseudoId, dialogId } = use(params);
    const { data, isPending } = useGetDialogmelding(personPseudoId, dialogId, {
        query: { gcTime: 2 * 60 * 1000 },
    });

    if (isPending || data === undefined) {
        return <div>skeleton</div>;
    }

    if (!data) {
        notFound();
    }

    return <DialogmeldingContent dialog={data} />;
}
