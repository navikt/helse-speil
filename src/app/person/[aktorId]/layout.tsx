'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/graphql/polling';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { EmojiTilbakemeldingMedPeriode } from '@saksbilde/feedback/EmojiTilbakemeldingMedPeriode';
import { Historikk } from '@saksbilde/historikk';
import { useResetOpenedDocuments } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { InfovarselOmStans } from '@saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@saksbilde/personHeader';
import { Timeline } from '@saksbilde/timeline';
import { useKeyboardShortcuts } from '@saksbilde/useKeyboardShortcuts';
import { Venstremeny } from '@saksbilde/venstremeny/Venstremeny';

import styles from './layout.module.css';

export default function Layout({ children }: PropsWithChildren): ReactElement {
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();
    useResetOpenedDocuments();

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
