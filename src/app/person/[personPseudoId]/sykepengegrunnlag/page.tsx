'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import { Tilbakemelding } from '@components/flexjar/Tilbakemeldinger';
import { Saksbilde } from '@saksbilde/Saksbilde';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { PeriodeView } from '@saksbilde/periodeview/PeriodeView';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';

const Historikk = dynamic(() => import('@saksbilde/historikk').then((mod) => mod.Historikk), {
    ssr: false,
    loading: () => <HistorikkSkeleton />,
});

export default function Page(): ReactElement | null {
    return (
        <>
            <Venstremeny />
            <Saksbilde>
                <PeriodeView />
            </Saksbilde>
            <Historikk />
            <Tilbakemelding.ForSaksbilde />
        </>
    );
}
