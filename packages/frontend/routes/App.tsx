import React, { PropsWithChildren, lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactModal from 'react-modal';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';

import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';
import { ErrorsInstrumentation, initializeFaro } from '@grafana/faro-web-sdk';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useAuthentication, useUpdateAuthentication } from '@state/authentication';
import { useFetchPersonQuery } from '@state/person';
import { useSetVarsler } from '@state/varsler';
import { onLazyLoadFail } from '@utils/error';
import { erDev, erLocal } from '@utils/featureToggles';

import nais from '../nais/nais';
import { GlobalFeilside } from './GlobalFeilside';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { PageNotFound } from './PageNotFound';
import { client } from './apolloClient';
import { AppRoutes } from './index';

import './App.css';

const Saksbilde = lazy(() =>
    import('./saksbilde/Saksbilde.js').then((res) => ({ default: res.Saksbilde })).catch(onLazyLoadFail),
);
const Oversikt = lazy(() =>
    import('./oversikt/Oversikt.js').then((res) => ({ default: res.Oversikt })).catch(onLazyLoadFail),
);
const GraphQLPlayground = lazy(() =>
    import('./playground/GraphQLPlayground.js')
        .then((res) => ({ default: res.GraphQLPlayground }))
        .catch(onLazyLoadFail),
);

ReactModal.setAppElement('#root');

const telemetryCollectorURL = nais.telemetryCollectorURL;
console.log(`URL fra nais.ts: ${telemetryCollectorURL}`);
(erLocal() || !telemetryCollectorURL.includes('localhost')) &&
    initializeFaro({
        url: nais.telemetryCollectorURL,
        app: nais.app,
        instrumentations: [new ErrorsInstrumentation()],
    });

const useSyncAlertsToLocation = () => {
    const location = useLocation();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) =>
            prevState.filter(
                (it) => it.scope === location.pathname || (it.name === 'tildeling' && location.pathname !== '/'),
            ),
        );
    }, [location]);
};

const App = () => {
    const { loading } = useFetchPersonQuery(true);

    useLoadingToast({ isLoading: loading, message: 'Henter person' });
    useUpdateAuthentication();

    useSyncAlertsToLocation();

    return (
        <ErrorBoundary fallback={(error) => <GlobalFeilside error={error} />}>
            <Helmet>
                <title>Speil {erLocal() ? ' - localhost' : erDev() ? ' - dev' : ''}</title>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/favicons/${erLocal() ? 'favicon-local.ico' : erDev() ? 'favicon-dev.ico' : 'favicon.ico'}`}
                />
            </Helmet>
            <Header />
            <Varsler />
            <Routes>
                <Route path={AppRoutes.Uautorisert} element={<IkkeLoggetInn />} />
                <Route
                    path={`${AppRoutes.Oversikt}/*`}
                    element={
                        <RequireAuth>
                            <React.Suspense fallback={<div />}>
                                <Oversikt />
                            </React.Suspense>
                        </RequireAuth>
                    }
                />
                <Route
                    path={AppRoutes.Saksbilde}
                    element={
                        <RequireAuth>
                            <React.Suspense fallback={<div />}>
                                <Saksbilde />
                            </React.Suspense>
                        </RequireAuth>
                    }
                />
                <Route
                    path={AppRoutes.Playground}
                    element={
                        <RequireAuth>
                            <React.Suspense fallback={<div />}>
                                <GraphQLPlayground />
                            </React.Suspense>
                        </RequireAuth>
                    }
                />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Toasts />
        </ErrorBoundary>
    );
};

const RequireAuth = ({ children }: PropsWithChildren) => {
    const { isLoggedIn } = useAuthentication();
    return isLoggedIn !== false ? children : <Navigate to="/uautorisert" />;
};

export const AppWithRoutingAndState = () => (
    <BrowserRouter>
        <RecoilRoot>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </RecoilRoot>
    </BrowserRouter>
);
