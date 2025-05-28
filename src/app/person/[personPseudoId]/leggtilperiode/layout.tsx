'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { LeggTilPeriodeSaksbilde } from '@saksbilde/leggTilPeriode/LeggTilPeriodeSaksbilde';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektHistorikk';
import { VenstremenyLeggTilPeriode } from '@saksbilde/venstremeny/VenstremenyLeggTilPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyLeggTilPeriode />
            <LeggTilPeriodeSaksbilde>{children}</LeggTilPeriodeSaksbilde>
            <TilkommenInntektHistorikk />
            <Tilbakemelding.ForSaksbilde />
        </>
    );
}
