'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { AndreYtelserSaksbilde } from '@saksbilde/andreYtelser/AndreYtelserSaksbilde';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { VenstremenyTilkommenInntekt } from '@saksbilde/venstremeny/VenstremenyTilkommenInntekt';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyTilkommenInntekt />
            <AndreYtelserSaksbilde>{children}</AndreYtelserSaksbilde>
            <VisHvisSkrivetilgang>
                <EmojiTilbakemeldingMedPeriode />
            </VisHvisSkrivetilgang>
        </>
    );
}
