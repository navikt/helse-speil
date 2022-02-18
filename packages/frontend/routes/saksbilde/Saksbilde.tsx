import styled from '@emotion/styled';
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

import { SaksbildeFullstendigPeriode } from './saksbilder/SaksbildeFullstendigPeriode';
import { TomtSaksbilde } from './saksbilder/SaksbildeTomt';
import { SaksbildeUfullstendigPeriode } from './saksbilder/SaksbildeUfullstendigPeriode';
import { Sakslinje } from './sakslinje/Sakslinje';
import { LasterTidslinje, Tidslinje } from './tidslinje';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';
import { AmplitudeProvider } from './AmplitudeContext';
import { VenterPåEndringProvider } from './VenterPåEndringContext';
import { LasterPersonlinje, Personlinje } from './Personlinje';
import { Loader } from '@navikt/ds-react';

import styles from './Saksbilde.module.css';

const Saksbildevarsel = styled(Varsel)`
    grid-column-start: venstremeny;
    grid-column-end: høyremeny;
`;

const SaksbildeContent = React.memo(() => {
    const aktivPeriode = useMaybeAktivPeriode();
    const personTilBehandling = usePerson();

    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();
    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);
    useKeyboardShortcuts(personTilBehandling);

    const { path } = useRouteMatch();

    if (!personTilBehandling) {
        return <LasterSaksbilde />;
    }

    return (
        <div className={styles.Saksbilde}>
            <Personlinje
                aktørId={personTilBehandling.aktørId}
                enhet={personTilBehandling.enhet}
                dødsdato={personTilBehandling.dødsdato}
            />
            <Tidslinje person={personTilBehandling} />
            {aktivPeriode ? (
                <AmplitudeProvider>
                    <VenterPåEndringProvider>
                        <Sakslinje aktivPeriode={aktivPeriode} />
                        <Switch>
                            <Route path={`${path}/utbetalingshistorikk`}>
                                <React.Suspense fallback={<div />}>
                                    <Utbetalingshistorikk person={personTilBehandling} />
                                </React.Suspense>
                            </Route>
                            <Route>
                                {aktivPeriode.fullstendig ? (
                                    <ErrorBoundary
                                        fallback={(error) => (
                                            <Saksbildevarsel variant="feil">{error.message}</Saksbildevarsel>
                                        )}
                                    >
                                        <SaksbildeFullstendigPeriode
                                            personTilBehandling={personTilBehandling}
                                            aktivPeriode={aktivPeriode}
                                        />
                                    </ErrorBoundary>
                                ) : (
                                    <SaksbildeUfullstendigPeriode aktivPeriode={aktivPeriode} />
                                )}
                            </Route>
                        </Switch>
                    </VenterPåEndringProvider>
                </AmplitudeProvider>
            ) : (
                <TomtSaksbilde />
            )}
        </div>
    );
});

const LasterSaksbilde = () => (
    <div className={styles.Saksbilde} data-testid="laster-saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
        <Loader className={styles.Loader} size="2xlarge" />
    </div>
);

export const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel variant="advarsel">{error.message}</Varsel>}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <SaksbildeContent />
        </React.Suspense>
    </ErrorBoundary>
);

export default Saksbilde;
