import React from 'react';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { Toasts } from '@components/Toasts';
import { Varsler } from '@components/Varsler';
import { Header } from '@components/header/Header';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { PageNotFound } from './PageNotFound';
import { useAuthentication } from '@state/authentication';
import { useEasterEggIsActive } from '@state/easterEgg';

import './App.css';
import { GlobalFeilside } from './GlobalFeilside';
import { Routes } from './index';
import { usePersonLoadable } from '@state/person';

const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde'));
const Oversikt = React.lazy(() => import('./oversikt'));
const Agurk = React.lazy(() => import('../components/Agurk'));
const GraphQLPlayground = React.lazy(() => import('./playground/GraphQLPlayground'));

ReactModal.setAppElement('#root');

const App = () => {
    useLoadingToast({ isLoading: usePersonLoadable().state === 'loading', message: 'Henter person' });
    useAuthentication();

    const easterEggIsActive = useEasterEggIsActive();

    return (
        <ErrorBoundary fallback={GlobalFeilside}>
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
            {easterEggIsActive('Agurk') && (
                <React.Suspense fallback={null}>
                    <Agurk />
                </React.Suspense>
            )}
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
