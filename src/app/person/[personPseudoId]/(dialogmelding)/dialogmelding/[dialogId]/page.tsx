'use client';

import { notFound } from 'next/navigation';
import React, { ReactElement, use } from 'react';

import { useGetDialogmeldinger } from '@io/rest/generated/default/default';
import { DialogmeldingContent } from '@saksbilde/dialogmelding/DialogmeldingContent';
import { finnDialog } from '@saksbilde/dialogmelding/testdata';

type DialogPageProps = {
    params: Promise<{ personPseudoId: string; dialogId: string }>;
};

export default function Page({ params }: DialogPageProps): ReactElement {
    const { personPseudoId, dialogId } = use(params);
    const { data, isPending } = useGetDialogmeldinger(personPseudoId);

    if (isPending || data === undefined) {
        return <div>skeleton</div>;
    }

    const dialog = finnDialog(data, dialogId);

    if (!dialog) {
        notFound();
    }

    return <DialogmeldingContent dialog={dialog} />;
}
