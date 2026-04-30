'use client';

import { notFound } from 'next/navigation';
import React, { ReactElement, use } from 'react';

import { DialogmeldingContent } from '@saksbilde/dialogmelding/DialogmeldingContent';
import { finnDialog, testBehandlere } from '@saksbilde/dialogmelding/testdata';

type DialogPageProps = {
    params: Promise<{ dialogId: string }>;
};

export default function Page({ params }: DialogPageProps): ReactElement {
    const { dialogId } = use(params);
    const dialog = finnDialog(testBehandlere, dialogId);

    if (!dialog) {
        notFound();
    }

    return <DialogmeldingContent dialog={dialog} />;
}
