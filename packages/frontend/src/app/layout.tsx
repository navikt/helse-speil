import { decodeJwt } from 'jose';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

import { getToken, parseAzureUserToken } from '@navikt/oasis';

import { Providers } from '@/app/providers';
import { browserEnv, isLocal } from '@/env';

import './globals.css';

export const metadata: Metadata = {
    title: `Speil ${isLocal ? ' - localhost' : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev' ? ' - dev' : ''}`,
};

function getTokenPayload() {
    const token = getToken(headers());
    if (!token) throw new Error('TODO skrive bedre feilmelding');
    const payload = parseAzureUserToken(token);
    if (!payload.ok) throw new Error('TODO skrive bedre feilmelding');
    const josePayload = decodeJwt<{ oid: string }>(token);
    return { ...payload, oid: josePayload.oid };
}

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
                        isLocal
                            ? 'favicon-local.ico'
                            : browserEnv.NEXT_PUBLIC_RUNTIME_ENV === 'dev'
                              ? 'favicon-dev.ico'
                              : 'favicon.ico'
                    }`}
                />
            </head>
            <body>
                <Providers
                    user={{
                        oid: payload.oid,
                        epost: payload.preferred_username,
                        navn: payload.name,
                        ident: payload.NAVident,
                    }}
                >
                    {children}
                </Providers>
            </body>
        </html>
    );
}
