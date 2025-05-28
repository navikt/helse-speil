'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { TilkommenInntektSaksbilde } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektSaksbilde';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektHistorikk';
import { VenstremenyTilkommenInntekt } from '@saksbilde/venstremeny/VenstremenyTilkommenInntekt';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyTilkommenInntekt />
            <TilkommenInntektSaksbilde>{children}</TilkommenInntektSaksbilde>
            <TilkommenInntektHistorikk />
            <Tilbakemelding.ForSaksbilde />
        </>
    );
}
