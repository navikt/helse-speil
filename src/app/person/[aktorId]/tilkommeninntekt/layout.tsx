'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/TilkommenInntektHistorikk';
import { TilkommenInntektSaksbilde } from '@saksbilde/tilkommenInntekt/TilkommenInntektSaksbilde';
import { VenstremenyTilkommenInntekt } from '@saksbilde/venstremeny/VenstremenyTilkommenInntekt';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyTilkommenInntekt />
            <TilkommenInntektSaksbilde>{children}</TilkommenInntektSaksbilde>
            <TilkommenInntektHistorikk />
            <EmojiTilbakemeldingMedPeriode />
        </>
    );
}
