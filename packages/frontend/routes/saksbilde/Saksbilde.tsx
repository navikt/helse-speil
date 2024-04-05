import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { EmojiTilbakemelding } from '@components/flexjar/EmojiTilbamelding';
import { Widget } from '@components/flexjar/Widget';
import { useFjernPersonFraApolloCache } from '@hooks/useFjernPersonFraApolloCache';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/http';
import { useActivePeriod, useSelectPeriodOnOppgaveChanged } from '@state/periode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onLazyLoadFail } from '@utils/error';
import { isBeregnetPeriode } from '@utils/typeguards';

import { VenterPåEndringProvider } from './VenterPåEndringContext';
import { PersonHeader } from './personHeader';
import { Timeline } from './timeline';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

import styles from './Saksbilde.module.css';

const PeriodeView = React.lazy(() =>
    import('./saksbilder/PeriodeView.js').then((res) => ({ default: res.PeriodeView })).catch(onLazyLoadFail),
);

export const Saksbilde = () => (
    <ErrorBoundary
        fallback={(error: Error) => (
            <Alert variant="warning" size="small" className={styles.Alert}>
                {error.message}
            </Alert>
        )}
    >
        <SaksbildeContent />
    </ErrorBoundary>
);

const SaksbildeContent = () => {
    useRefreshPersonVedOpptegnelse();
    useFjernPersonFraApolloCache();
    usePollEtterOpptegnelser();
    useSelectPeriodOnOppgaveChanged();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();
    const aktivPeriode = useActivePeriod();
    const queryClient = new QueryClient();

    return (
        <div className={styles.Saksbilde}>
            <PersonHeader />
            <Timeline />
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <Routes>
                        <Route path="/*" element={<PeriodeView />} />
                    </Routes>
                    <QueryClientProvider client={queryClient}>
                        <Widget>
                            <EmojiTilbakemelding
                                feedbackId="speil-generell"
                                tittel="Hjelp oss å gjøre Speil bedre"
                                sporsmal="Hvordan fungerer Speil for deg?"
                                feedbackProps={{
                                    egenskaper:
                                        isBeregnetPeriode(aktivPeriode) &&
                                        aktivPeriode.egenskaper.map((it) => it.egenskap),
                                }}
                            />
                        </Widget>
                    </QueryClientProvider>
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
};
