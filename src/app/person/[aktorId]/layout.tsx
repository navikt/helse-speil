'use client';

import dynamic from 'next/dynamic';
import React, { PropsWithChildren, ReactElement } from 'react';

import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useRefetchDriftsmeldinger } from '@hooks/useRefetchDriftsmeldinger';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { Saksbilde } from '@saksbilde/Saksbilde';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { HistorikkSkeleton } from '@saksbilde/historikk/hendelser/HistorikkSkeleton';
import { useResetOpenedDocuments } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { InfovarselOmStans } from '@saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@saksbilde/personHeader';
import { Timeline } from '@saksbilde/timeline';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';

import styles from './layout.module.css';

const Historikk = dynamic(() => import('@saksbilde/historikk').then((mod) => mod.Historikk), {
    ssr: false,
    loading: () => <HistorikkSkeleton />,
});

export default function Layout({ children }: PropsWithChildren): ReactElement {
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();
    useResetOpenedDocuments();
    useRefetchDriftsmeldinger();

    return (
        <div className={styles.Saksbilde}>
            <InfovarselOmStans />
            <PersonHeader />
            <Timeline />
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <Venstremeny />
                    <Saksbilde>{children}</Saksbilde>
                    <Historikk />
                    <EmojiTilbakemeldingMedPeriode />
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
}
