'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { AndreYtelserSaksbilde } from '@saksbilde/andreYtelser/AndreYtelserSaksbilde';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { VenstremenyUtenPeriode } from '@saksbilde/venstremeny/VenstremenyUtenPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyUtenPeriode />
            <AndreYtelserSaksbilde>{children}</AndreYtelserSaksbilde>
            <VisHvisSkrivetilgang>
                <EmojiTilbakemeldingMedPeriode />
            </VisHvisSkrivetilgang>
        </>
    );
}
