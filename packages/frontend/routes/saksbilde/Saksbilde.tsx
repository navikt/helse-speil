import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Varsel } from '@components/Varsel';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Scopes, useVarselFilter } from '@state/varsler';
import { SaksbildeMenu } from './sakslinje/SaksbildeMenu';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';
import { AmplitudeProvider } from './AmplitudeContext';
import { VenterPåEndringProvider } from './VenterPåEndringContext';
import { PersonHeader } from './PersonHeader';

import { Timeline } from './timeline/Timeline';

import styles from './Saksbilde.module.css';
import { PeriodeView } from './saksbilder/PeriodeView';
import { useRefreshPersonVedUrlEndring } from '@hooks/useRefreshPersonVedUrlEndring';

const SaksbildeContent = React.memo(() => {
    // const aktivPeriode = useMaybeAktivPeriode();
    // const activePeriod = useActivePeriod();
    // const personTilBehandling = usePerson();
    // const personGraphQL = useCurrentPerson();

    useRefreshPersonVedUrlEndring();
    // useRefreshPersonVedOpptegnelse();
    // usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);
    // useKeyboardShortcuts(personTilBehandling);

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
