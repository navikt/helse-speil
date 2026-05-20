'use client';

import { usePathname } from 'next/navigation';
import React, { PropsWithChildren, ReactElement } from 'react';

import { DialogmeldingHeader } from '@saksbilde/dialogmelding/DialogmeldingHeader';
import { Dokumentvisning } from '@saksbilde/dialogmelding/dokumentvisning/Dokumentvisning';
import { VenstremenyDialogmelding } from '@saksbilde/dialogmelding/venstremeny/VenstremenyDialogmelding';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    const pathname = usePathname();
    const isNyRoute = pathname.includes('/ny');

    return (
        <div className="contents">
            <DialogmeldingHeader />
            <VenstremenyDialogmelding />
            {children}
            {!isNyRoute && <Dokumentvisning />}
        </div>
    );
}
