'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VenterPåEndringProvider } from '@/routes/saksbilde/VenterPåEndringContext';
import { EmojiTilbakemeldingMedPeriode } from '@/routes/saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { Historikk } from '@/routes/saksbilde/historikk';
import { InfovarselOmStans } from '@/routes/saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@/routes/saksbilde/personHeader';
import { Timeline } from '@/routes/saksbilde/timeline';
import { useKeyboardShortcuts } from '@/routes/saksbilde/useKeyboardShortcuts';
import { Venstremeny } from '@/routes/saksbilde/venstremeny/Venstremeny';
import { useFjernPersonFraApolloCache } from '@hooks/useFjernPersonFraApolloCache';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/http';

import styles from './layout.module.css';

function Layout({ children }: PropsWithChildren): ReactElement {
    useRefreshPersonVedOpptegnelse();
    useFjernPersonFraApolloCache();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();

    return (
        <div className={styles.Saksbilde}>
            <InfovarselOmStans />
            <PersonHeader />
            <Timeline />
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <Venstremeny />
                    {children}
                    <Historikk />
                    <EmojiTilbakemeldingMedPeriode />
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
}

export default Layout;
