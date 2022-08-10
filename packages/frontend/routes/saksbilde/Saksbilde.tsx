import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Varsel } from '@components/Varsel';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useRefreshPersonVedUrlEndring } from '@hooks/useRefreshPersonVedUrlEndring';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useVarselOmSakErTildeltAnnenSaksbehandler } from '@hooks/useVarselOmSakErTildeltAnnenSaksbehandler';
import { usePollEtterOpptegnelser } from '@io/http';
import { AmplitudeProvider } from '@io/amplitude';

import { Timeline } from './timeline';
import { PeriodeView } from './saksbilder/PeriodeView';
import { PersonHeader } from './personHeader';
import { SaksbildeMenu } from './sakslinje/SaksbildeMenu';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { VenterPåEndringProvider } from './VenterPåEndringContext';

import styles from './Saksbilde.module.css';

const Utbetalingshistorikk = React.lazy(() => import('./utbetalingshistorikk/Utbetalingshistorikk'));

const SaksbildeContent = React.memo(() => {
    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselOmSakErTildeltAnnenSaksbehandler();
    useKeyboardShortcuts();

    const { path } = useRouteMatch();

    return (
        <div className={styles.Saksbilde}>
            <PersonHeader />
            <Timeline />
            <AmplitudeProvider>
                <VenterPåEndringProvider>
                    <SaksbildeMenu />
                    <Switch>
                        <Route path={`${path}/utbetalingshistorikk`}>
                            <Utbetalingshistorikk />
                        </Route>
                        <Route>
                            <PeriodeView />
                        </Route>
                    </Switch>
                </VenterPåEndringProvider>
            </AmplitudeProvider>
        </div>
    );
});

const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel variant="warning">{error.message}</Varsel>}>
        <SaksbildeContent />
    </ErrorBoundary>
);

export default Saksbilde;
