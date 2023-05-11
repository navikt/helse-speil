import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useUpdateAuthentication } from '@state/authentication';
import { usePersonLoadable } from '@state/person';
import { useSetVarsler } from '@state/varsler';
import { onLazyLoadFail } from '@utils/error';
import { erDev, erLocal } from '@utils/featureToggles';

import { GlobalFeilside } from './GlobalFeilside';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { PageNotFound } from './PageNotFound';
import { Routes } from './index';

import './App.css';

// @ts-ignore
const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde').catch(onLazyLoadFail));
// @ts-ignore
const Oversikt = React.lazy(() => import('./oversikt').catch(onLazyLoadFail));
// @ts-ignore
const GraphQLPlayground = React.lazy(() => import('./playground/GraphQLPlayground').catch(onLazyLoadFail));

ReactModal.setAppElement('#root');

const useSyncAlertsToLocation = () => {
    const location = useLocation();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) =>
            prevState.filter(
                (it) => it.scope === location.pathname || (it.name === 'tildeling' && location.pathname !== '/')
            )
        );
    }, [location]);
};

const App = () => {
    useLoadingToast({ isLoading: usePersonLoadable().state === 'loading', message: 'Henter person' });
    useUpdateAuthentication();

    useSyncAlertsToLocation();

    return (
        <ErrorBoundary fallback={(error) => <GlobalFeilside error={error} />}>
            <Helmet>
                <title>Speil {erLocal() ? ' - localhost' : erDev() ? ' - dev' : ''}</title>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`./assets/favicons/${
                        erLocal() ? 'favicon-local.ico' : erDev() ? 'favicon-dev.ico' : '/favicon.ico'
                    }`}
                />
            </Helmet>
            <Header />
            <Varsler />
            <Switch>
                <Route path={Routes.Uautorisert}>
                    <IkkeLoggetInn />
                </Route>
                <ProtectedRoute path={Routes.Oversikt} exact>
                    <React.Suspense fallback={<div />}>
                        <Oversikt />
                    </React.Suspense>
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Saksbilde}>
                    <React.Suspense fallback={<div />}>
                        <Saksbilde />
                    </React.Suspense>
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Playground}>
                    <React.Suspense fallback={<div />}>
                        <GraphQLPlayground />
                    </React.Suspense>
                </ProtectedRoute>
                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
            <Toasts />
        </ErrorBoundary>
    );
};

const withRoutingAndState = (Component: React.ComponentType) => () =>
    (
        <BrowserRouter>
            <RecoilRoot>
                <Component />
            </RecoilRoot>
        </BrowserRouter>
    );

export default withRoutingAndState(App);
