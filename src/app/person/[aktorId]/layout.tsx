'use client';

import { createStore } from 'jotai/index';
import dynamic from 'next/dynamic';
import React, { PropsWithChildren, ReactElement, use, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useRefetchDriftsmeldinger } from '@hooks/useRefetchDriftsmeldinger';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { OpprettAbonnementDocument } from '@io/graphql';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { Saksbilde } from '@saksbilde/Saksbilde';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { useResetOpenedDocuments } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { InfovarselOmStans } from '@saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@saksbilde/personHeader';
import { Timeline } from '@saksbilde/timeline';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';
import { PersonStoreContext } from '@state/contexts/personStore';

import styles from './layout.module.css';

const Historikk = dynamic(() => import('@saksbilde/historikk').then((mod) => mod.Historikk), {
    ssr: false,
    loading: () => <HistorikkSkeleton />,
});

type LayoutProps = {
    params: Promise<{ aktorId: string }>;
};

export default function Layout({ children, params }: PropsWithChildren<LayoutProps>): ReactElement {
    const { aktorId } = use(params);
    const [opprettAbonnement] = useMutation(OpprettAbonnementDocument);

    useEffect(() => {
        if (aktorId) {
            void opprettAbonnement({ variables: { personidentifikator: aktorId } });
        }
    }, [aktorId, opprettAbonnement]);

    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();
    useResetOpenedDocuments();
    useRefetchDriftsmeldinger();

    return <AktorScopedLayout key={aktorId}>{children}</AktorScopedLayout>;
}

const AktorScopedLayout = ({ children }: PropsWithChildren): ReactElement => {
    const [personStore] = useState(createStore());

    return (
        <PersonStoreContext.Provider value={personStore}>
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
        </PersonStoreContext.Provider>
    );
};
