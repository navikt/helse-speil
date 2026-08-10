'use client';

import React, { ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { TilkommenInntektSaksbilde } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektSaksbilde';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektHistorikk';
import { VenstremenyTilkommenInntekt } from '@saksbilde/venstremeny/VenstremenyTilkommenInntekt';

export default function Layout(): ReactElement {
    return (
        <>
            <VenstremenyTilkommenInntekt />
            <TilkommenInntektSaksbilde />
            <TilkommenInntektHistorikk />
            <VisHvisSkrivetilgang>
                <EmojiTilbakemeldingMedPeriode />
            </VisHvisSkrivetilgang>
        </>
    );
}
