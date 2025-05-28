'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { TilkommenInntektSaksbilde } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektSaksbilde';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektHistorikk';
import { VenstremenyLeggTilPeriode } from '@saksbilde/venstremeny/VenstremenyLeggTilPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyLeggTilPeriode />
            <TilkommenInntektSaksbilde>{children}</TilkommenInntektSaksbilde>
            <TilkommenInntektHistorikk />
            <Tilbakemelding.ForSaksbilde />
        </>
    );
}
