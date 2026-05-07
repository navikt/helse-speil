'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { DialogmeldingHeader } from '@saksbilde/dialogmelding/DialogmeldingHeader';
import { Dokumentvisning } from '@saksbilde/dialogmelding/dokumentvisning/Dokumentvisning';
import { VenstremenyDialogmelding } from '@saksbilde/dialogmelding/venstremeny/VenstremenyDialogmelding';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <div className="contents">
            <DialogmeldingHeader />
            <VenstremenyDialogmelding />
            {children}
            <Dokumentvisning />
        </div>
    );
}
