'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { LeggTilPeriodeSaksbilde } from '@saksbilde/leggTilPeriode/LeggTilPeriodeSaksbilde';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektHistorikk';
import { VenstremenyLeggTilPeriode } from '@saksbilde/venstremeny/VenstremenyLeggTilPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyLeggTilPeriode />
            <LeggTilPeriodeSaksbilde>{children}</LeggTilPeriodeSaksbilde>
            <TilkommenInntektHistorikk />
            <EmojiTilbakemeldingMedPeriode />
        </>
    );
}
