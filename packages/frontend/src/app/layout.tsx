import type { Metadata } from 'next';
import React from 'react';

import { Providers } from '@/app/providers';
import { getTokenPayload } from '@/auth/token';
import { browserEnv, erLokal } from '@/env';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';

import './globals.css';

export const metadata: Metadata = {
    title: `Speil ${erLokal ? ' - localhost' : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev' ? ' - dev' : ''}`,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const payload = getTokenPayload();

    return (
        <html lang="en">
            <head>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/favicons/${
                        erLokal
                            ? 'favicon-local.ico'
                            : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
                              ? 'favicon-dev.ico'
                              : 'favicon.ico'
                    }`}
                />
                <link
                    rel="preload"
                    href="https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            <body>
                {/*TODO: Kan fjernes når vi går over til aksel sin modal*/}
                <div id="root">
                    <Providers
                        bruker={{
                            oid: payload.oid,
                            epost: payload.preferred_username,
                            navn: payload.name,
                            ident: payload.NAVident,
                            grupper: payload.groups,
                        }}
                    >
                        <Header />
                        <Varsler />
                        {children}
                        <Toasts />
                    </Providers>
                </div>
            </body>
        </html>
    );
}
