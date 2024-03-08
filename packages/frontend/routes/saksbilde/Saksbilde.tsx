import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Tilbakemelding } from '@components/flexjar/Tilbakemelding';
import { Widget } from '@components/flexjar/Widget';
import { useFjernPersonFraApolloCache } from '@hooks/useFjernPersonFraApolloCache';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/http';
import { useSelectPeriodOnOppgaveChanged } from '@state/periode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onLazyLoadFail } from '@utils/error';
import { flexjar } from '@utils/featureToggles';

import { VenterPåEndringProvider } from './VenterPåEndringContext';
import { PersonHeader } from './personHeader';
import { Timeline } from './timeline';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

import styles from './Saksbilde.module.css';

const Utbetalingshistorikk = React.lazy(() =>
    import('./utbetalingshistorikk/Utbetalingshistorikk.js')
        .then((res) => ({ default: res.Utbetalingshistorikk }))
        .catch(onLazyLoadFail),
);

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
    const queryClient = new QueryClient();

    return (
        <div className={styles.Saksbilde}>
            <PersonHeader />
            <Timeline />
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <Routes>
                        <Route path="utbetalingshistorikk" element={<Utbetalingshistorikk />} />
                        <Route path="/*" element={<PeriodeView />} />
                    </Routes>
                    {flexjar && (
                        <QueryClientProvider client={queryClient}>
                            <Widget>
                                <Tilbakemelding
                                    feedbackId="test"
                                    tittel="Hjelp oss med å gjøre siden bedre"
                                    sporsmal="Har du noen forslag til forbedringer?"
                                />
                            </Widget>
                        </QueryClientProvider>
                    )}
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
};
