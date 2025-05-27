'use client';

import { createStore } from 'jotai';
import React, { PropsWithChildren, ReactElement, use, useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useOppdaterPersondataEnGang } from '@hooks/useOppdaterPersondataEnGang';
import { useRefetchDriftsmeldinger } from '@hooks/useRefetchDriftsmeldinger';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { OpprettAbonnementDocument } from '@io/graphql';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { useResetOpenedDocuments } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { InfovarselOmStans } from '@saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@saksbilde/personHeader';
import { Timeline } from '@saksbilde/timeline';
import { PersonStoreContext } from '@state/contexts/personStore';

import styles from './layout.module.css';

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
    useOppdaterPersondataEnGang();
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
                    <VenterPåEndringProvider>{children}</VenterPåEndringProvider>
                </AmplitudeProvider>
            </div>
        </PersonStoreContext.Provider>
    );
};
