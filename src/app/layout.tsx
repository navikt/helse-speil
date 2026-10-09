import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script';
import React, { PropsWithChildren, ReactElement } from 'react';

import { backend, erDev, erUtvikling } from '@/env';
import { Preload } from '@app/preload';
import { Providers } from '@app/providers';
import { getTokenPayload } from '@auth/token';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Driftsmeldinger } from '@components/driftsmeldinger/Driftsmeldinger';
import { Header } from '@components/header/Header';

export const metadata: Metadata = {
    title: `Speil ${backend !== 'deployed' ? ' - localhost' : erDev ? ' - dev' : ''}`,
    icons: {
        icon: `/favicons/${backend !== 'deployed' ? 'favicon-local.ico' : erDev ? 'favicon-dev.ico' : 'favicon.ico'}`,
    },
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    const payload = await getTokenPayload();

    return (
        <html lang="no" suppressHydrationWarning>
            {erUtvikling && (
                <Script
                    defer
                    strategy="afterInteractive"
                    src={`https://cdn.nav.no/team-researchops/sporing/sporing${erUtvikling ? '-dev' : ''}.js`}
                    data-website-id={process.env.NEXT_INNBLIKK_CODE}
                />
            )}
            <Preload />
            <body>
                <Providers
                    bruker={{
                        oid: payload.oid,
                        epost: payload.preferred_username,
                        navn: payload.name,
                        ident: payload.NAVident,
                    }}
                >
                    <Driftsmeldinger />
                    <Header />
                    <Varsler />
                    {children}
                    <Toasts />
                </Providers>
            </body>
        </html>
    );
}
