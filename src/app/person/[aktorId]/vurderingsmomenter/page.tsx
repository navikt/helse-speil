'use client';

import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { Saksbilde } from '@saksbilde/Saksbilde';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { PeriodeView } from '@saksbilde/periodeview/PeriodeView';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';

const Historikk = dynamic(() => import('@saksbilde/historikk').then((mod) => mod.Historikk), {
    ssr: false,
    loading: () => <HistorikkSkeleton />,
});

export default function Page(): Maybe<ReactElement> {
    return (
        <>
            <Venstremeny />
            <Saksbilde>
                <PeriodeView />
            </Saksbilde>
            <Historikk />
            <EmojiTilbakemeldingMedPeriode />
        </>
    );
}
