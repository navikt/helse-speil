'use client';

import { createStore } from 'jotai';
import React, { PropsWithChildren, ReactElement, use, useEffect, useState } from 'react';

import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { useOppdaterPersondataEnGang } from '@hooks/useOppdaterPersondataEnGang';
import { useRefetchDriftsmeldinger } from '@hooks/useRefetchDriftsmeldinger';
import { useRefreshPersonVedEvent } from '@hooks/useRefreshPersonVedEvent';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { useAbonnerPåEndringer } from '@io/sse/useAbonnerPåEndringer';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { useResetOpenedDocuments } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { InfovarselOmStans } from '@saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@saksbilde/personHeader';
import { Tidslinje } from '@saksbilde/tidslinje/Tidslinje';
import { VarselOmFlerFødselsnumre } from '@saksbilde/varselOmFlerFødselsnumre/VarselOmFlerFødselsnumre';
import { PersonStoreContext } from '@state/contexts/personStore';

import styles from './layout.module.css';

type LayoutProps = {
    params: Promise<{ personPseudoId: string }>;
};

export default function Layout({ children, params }: PropsWithChildren<LayoutProps>): ReactElement {
    const { personPseudoId } = use(params);

    useEffect(() => {
        document.documentElement.classList.add('overflow-y-scroll');
        return () => document.documentElement.classList.remove('overflow-y-scroll');
    }, []);

    useRefreshPersonVedEvent();
    useOppdaterPersondataEnGang();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useAbonnerPåEndringer(personPseudoId);
    useKeyboardShortcuts();
    useResetOpenedDocuments();
    useRefetchDriftsmeldinger();

    return <AktorScopedLayout key={personPseudoId}>{children}</AktorScopedLayout>;
}

const AktorScopedLayout = ({ children }: PropsWithChildren): ReactElement => {
    const [personStore] = useState(createStore());

    return (
        <PersonStoreContext.Provider value={personStore}>
            <div className={styles.Saksbilde}>
                <InfovarselOmStans />
                <VarselOmFlerFødselsnumre />
                <PersonHeader />
                <Tidslinje />
                <VenterPåEndringProvider>{children}</VenterPåEndringProvider>
            </div>
        </PersonStoreContext.Provider>
    );
};
