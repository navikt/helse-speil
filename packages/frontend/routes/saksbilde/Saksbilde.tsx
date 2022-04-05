import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Varsel } from '@components/Varsel';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Scopes, useVarselFilter } from '@state/varsler';
import { useRefreshPersonVedUrlEndring } from '@hooks/useRefreshPersonVedUrlEndring';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { usePollEtterOpptegnelser } from '@io/http';

import { Timeline } from './timeline/Timeline';
import { PeriodeView } from './saksbilder/PeriodeView';
import { PersonHeader } from './PersonHeader';
import { SaksbildeMenu } from './sakslinje/SaksbildeMenu';
import { AmplitudeProvider } from './AmplitudeContext';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';
import { VenterPåEndringProvider } from './VenterPåEndringContext';

import styles from './Saksbilde.module.css';

const SaksbildeContent = React.memo(() => {
    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);
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
    <ErrorBoundary fallback={(error: Error) => <Varsel variant="advarsel">{error.message}</Varsel>}>
        <SaksbildeContent />
    </ErrorBoundary>
);

export default Saksbilde;
