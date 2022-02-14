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

const Container = styled.div`
    --content-width: calc(100% - var(--speil-venstremeny-width) - var(--speil-hoyremeny-width));
    display: grid;
    max-width: 100vw;
    min-width: var(--speil-total-min-width);
    grid-template-columns: var(--speil-venstremeny-width) var(--content-width) var(--speil-hoyremeny-width);
    grid-template-rows: max-content max-content max-content auto;
    grid-template-areas:
        'personlinje personlinje personlinje'
        'tidslinje tidslinje tidslinje'
        'sakslinje sakslinje sakslinje'
        'venstremeny content høyremeny';
    flex: 1;
    height: max-content;
    transition: 0.2s ease;
`;

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
        <Container className="Saksbilde">
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
                                <Utbetalingshistorikk person={personTilBehandling} />
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
        </Container>
    );
});

const LasterSaksbilde = () => (
    <Container className="saksbilde" data-testid="laster-saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
    </Container>
);

export const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel variant="advarsel">{error.message}</Varsel>}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <SaksbildeContent />
        </React.Suspense>
    </ErrorBoundary>
);

export default Saksbilde;
