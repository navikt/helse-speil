import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script';
import React, { PropsWithChildren, ReactElement } from 'react';

import { browserEnv, erDev, erProd, spesialistBackend } from '@/env';
import { Preload } from '@app/preload';
import { Providers } from '@app/providers';
import { getTokenPayload } from '@auth/token';
import { PersonSomKlargjøres } from '@components/PersonSomKlargjøres';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Driftsmeldinger } from '@components/driftsmeldinger/Driftsmeldinger';
import { Header } from '@components/header/Header';

export const metadata: Metadata = {
    title: `Speil ${spesialistBackend !== 'deployed' ? ' - localhost' : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev' ? ' - dev' : ''}`,
    icons: {
        icon: `/favicons/${
            spesialistBackend !== 'deployed'
                ? 'favicon-local.ico'
                : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
                  ? 'favicon-dev.ico'
                  : 'favicon.ico'
        }`,
    },
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    const payload = await getTokenPayload();

    function umamiAnalytics() {
        if (!erDev) {
            return <></>;
        }
        return (
            <Script
                defer
                strategy="afterInteractive"
                src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
                data-host-url={erProd ? 'https://umami.nav.no' : 'https://reops-event-proxy.ekstern.dev.nav.no/'}
                data-website-id="79077f8d-4fe9-4ef1-82e1-dde6af454cd3"
                data-auto-track="false"
            />
        );
    }

    return (
        <html lang="no" suppressHydrationWarning>
            <head>{umamiAnalytics()}</head>
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
                    <PersonSomKlargjøres />
                    {children}
                    <Toasts />
                </Providers>
            </body>
        </html>
    );
}
