import type { Metadata } from 'next';
import React, { PropsWithChildren, ReactElement } from 'react';
import ReactDOM from 'react-dom';

import { browserEnv, erLokal } from '@/env';
import { Providers } from '@app/providers';
import { getTokenPayload } from '@auth/token';
import { PersonSomKlargjøres } from '@components/PersonSomKlargjøres';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Driftsmeldinger } from '@components/driftsmeldinger/Driftsmeldinger';
import { Header } from '@components/header/Header';

import './globals.css';

export const metadata: Metadata = {
    title: `Speil ${erLokal ? ' - localhost' : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev' ? ' - dev' : ''}`,
    icons: {
        icon: `/favicons/${
            erLokal
                ? 'favicon-local.ico'
                : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
                  ? 'favicon-dev.ico'
                  : 'favicon.ico'
        }`,
    },
};

ReactDOM.preload('https://cdn.nav.no/aksel/fonts/SourceSans3-normal.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
});

export default async function RootLayout({ children }: Readonly<PropsWithChildren>): Promise<ReactElement> {
    const payload = await getTokenPayload();

    return (
        <html lang="en">
            <Providers
                bruker={{
                    oid: payload.oid,
                    epost: payload.preferred_username,
                    navn: payload.name,
                    ident: payload.NAVident,
                    grupper: payload.groups,
                }}
            >
                <Driftsmeldinger />
                <Header />
                <Varsler />
                <PersonSomKlargjøres />
                {children}
                <Toasts />
            </Providers>
        </html>
    );
}
