'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { Saksbilde } from '@saksbilde/Saksbilde';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';

const Historikk = dynamic(() => import('@saksbilde/historikk').then((mod) => mod.Historikk), {
    ssr: false,
    loading: () => <HistorikkSkeleton />,
});

export default function Page(): ReactElement {
    return (
        <>
            <Venstremeny />
            <Saksbilde />
            <Historikk />
            <VisHvisSkrivetilgang>
                <Tilbakemelding.ForSaksbilde />
            </VisHvisSkrivetilgang>
        </>
    );
}
