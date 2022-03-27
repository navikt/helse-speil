import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Varsel } from '@components/Varsel';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useRefreshPersonVedOpptegnelse } from '@hooks/useRefreshPersonVedOpptegnelse';
import { useRefreshPersonVedUrlEndring } from '@hooks/useRefreshPersonVedUrlEndring';
import { usePollEtterOpptegnelser } from '@io/http/polling';
import { usePerson } from '@state/person';
import { useMaybeAktivPeriode } from '@state/tidslinje';
import { Scopes, useVarselFilter } from '@state/varsler';
import { SaksbildeMenu } from './sakslinje/SaksbildeMenu';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';
import { AmplitudeProvider } from './AmplitudeContext';
import { VenterPåEndringProvider } from './VenterPåEndringContext';
import { PersonHeader } from './PersonHeader';

import { Timeline } from './timeline/Timeline';
import { useCurrentPerson } from '@state/personState';
import { useActivePeriod } from '@state/periodState';

import styles from './Saksbilde.module.css';
import { PeriodeView } from './saksbilder/PeriodeView';

const SaksbildeContent = React.memo(() => {
    const aktivPeriode = useMaybeAktivPeriode();
    const activePeriod = useActivePeriod();
    const personTilBehandling = usePerson();
    const personGraphQL = useCurrentPerson();

    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);
    useKeyboardShortcuts(personTilBehandling);

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
