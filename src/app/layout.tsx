import './globals.css';

import type { Metadata } from 'next';
import React, { PropsWithChildren, ReactElement } from 'react';

import { backend, browserEnv } from '@/env';
import { Preload } from '@app/preload';
import { Providers } from '@app/providers';
import { getTokenPayload } from '@auth/token';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Driftsmeldinger } from '@components/driftsmeldinger/Driftsmeldinger';
import { Header } from '@components/header/Header';

export const metadata: Metadata = {
    title: `Speil ${backend !== 'deployed' ? ' - localhost' : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev' ? ' - dev' : ''}`,
    icons: {
        icon: `/favicons/${
            backend !== 'deployed'
                ? 'favicon-local.ico'
                : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
                  ? 'favicon-dev.ico'
                  : 'favicon.ico'
        }`,
    },
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    const payload = await getTokenPayload();

    return (
        <html lang="no" suppressHydrationWarning>
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
