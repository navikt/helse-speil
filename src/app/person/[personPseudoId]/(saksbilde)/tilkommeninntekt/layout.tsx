'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { TilkommenInntektSaksbilde } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektSaksbilde';
import { TilkommenInntektHistorikk } from '@saksbilde/tilkommenInntekt/visning/TilkommenInntektHistorikk';
import { VenstremenyUtenPeriode } from '@saksbilde/venstremeny/VenstremenyUtenPeriode';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <VenstremenyUtenPeriode />
            <TilkommenInntektSaksbilde>{children}</TilkommenInntektSaksbilde>
            <TilkommenInntektHistorikk />
            <VisHvisSkrivetilgang>
                <Tilbakemelding.ForSaksbilde />
            </VisHvisSkrivetilgang>
        </>
    );
}
