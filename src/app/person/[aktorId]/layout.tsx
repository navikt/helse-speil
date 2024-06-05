'use client';

import React, { PropsWithChildren, ReactElement } from 'react';

import { VenterPåEndringProvider } from '@/routes/saksbilde/VenterPåEndringContext';
import { Historikk } from '@/routes/saksbilde/historikk';
import { InfovarselOmStans } from '@/routes/saksbilde/infovarselOmStans/InfovarselOmStans';
import { PersonHeader } from '@/routes/saksbilde/personHeader';
import { Timeline } from '@/routes/saksbilde/timeline';
import { useKeyboardShortcuts } from '@/routes/saksbilde/useKeyboardShortcuts';
import { Venstremeny } from '@/routes/saksbilde/venstremeny/Venstremeny';
import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useFjernPersonFraApolloCache } from '@hooks/useFjernPersonFraApolloCache';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/http';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

import styles from './layout.module.css';

function Layout({ children }: PropsWithChildren): ReactElement {
    useRefreshPersonVedOpptegnelse();
    useFjernPersonFraApolloCache();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();
    const aktivPeriode = useActivePeriod();

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
                    <Widget>
                        <EmojiTilbakemelding
                            feedbackId="speil-generell"
                            tittel="Hjelp oss å gjøre Speil bedre"
                            sporsmal="Hvordan fungerer Speil for deg?"
                            feedbackProps={{
                                egenskaper:
                                    isBeregnetPeriode(aktivPeriode) && aktivPeriode.egenskaper.map((it) => it.egenskap),
                            }}
                        />
                    </Widget>
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
}

export default Layout;
