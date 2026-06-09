'use client';

import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import React, { PropsWithChildren, ReactElement } from 'react';

import { DialogmeldingHeader } from '@saksbilde/dialogmelding/DialogmeldingHeader';
import { SelectedVedleggProvider } from '@saksbilde/dialogmelding/dokumentvisning/vedleggContext';
import { VenstremenyDialogmelding } from '@saksbilde/dialogmelding/venstremeny/VenstremenyDialogmelding';

// Lastes kun på klienten: bredden leses fra localStorage, så server-rendering ville gitt
// hydration-mismatch / glimt av standardbredde ved refresh.
const Dokumentvisning = dynamic(
    () => import('@saksbilde/dialogmelding/dokumentvisning/Dokumentvisning').then((mod) => mod.Dokumentvisning),
    { ssr: false },
);

export default function Layout({ children }: PropsWithChildren): ReactElement {
    const pathname = usePathname();
    const { dialogId } = useParams<{ dialogId?: string }>();
    const isNyRoute = pathname.includes('/ny');

    return (
        <div className="contents">
            <DialogmeldingHeader />
            <VenstremenyDialogmelding />
            <SelectedVedleggProvider key={dialogId ?? 'ingen-dialog'}>
                {children}
                {!isNyRoute && <Dokumentvisning />}
            </SelectedVedleggProvider>
        </div>
    );
}
