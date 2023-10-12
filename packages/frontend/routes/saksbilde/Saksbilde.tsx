import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useRefreshPersonVedUrlEndring } from '@hooks/useRefreshPersonVedUrlEndring';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { AmplitudeProvider } from '@io/amplitude';
import { usePollEtterOpptegnelser } from '@io/http';
import { onLazyLoadFail } from '@utils/error';

import { VenterPåEndringProvider } from './VenterPåEndringContext';
import { PersonHeader } from './personHeader';
import { SaksbildeMenu } from './saksbildeMenu/SaksbildeMenu';
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

const SaksbildeContent = React.memo(() => {
    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();

    return (
        <div className={styles.Saksbilde}>
            <PersonHeader />
            <Timeline />
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <SaksbildeMenu />
                    <Routes>
                        <Route path="utbetalingshistorikk" element={<Utbetalingshistorikk />} />
                        <Route path="/*" element={<PeriodeView />} />
                    </Routes>
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
});
