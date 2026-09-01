'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { LeggTilSaksbilde } from '@saksbilde/leggTil/LeggTilSaksbilde';
import { VenstremenyUtenPeriode } from '@saksbilde/venstremeny/VenstremenyUtenPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyUtenPeriode />
            <LeggTilSaksbilde>{children}</LeggTilSaksbilde>
            <VisHvisSkrivetilgang>
                <EmojiTilbakemeldingMedPeriode />
            </VisHvisSkrivetilgang>
        </>
    );
}
