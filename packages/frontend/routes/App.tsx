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
import { useIsLoadingPerson } from '@state/person';

import './App.css';
import { GlobalFeilside } from './GlobalFeilside';
import { Routes } from './index';

const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde'));
const Oversikt = React.lazy(() => import('./oversikt'));
const Agurk = React.lazy(() => import('../components/Agurk'));
const GraphQLPlayground = React.lazy(() => import('./playground/GraphQLPlayground'));

ReactModal.setAppElement('#root');

const App = () => {
    useLoadingToast({ isLoading: useIsLoadingPerson(), message: 'Henter person' });
    useAuthentication();

    const easterEggIsActive = useEasterEggIsActive();

    return (
        <ErrorBoundary fallback={GlobalFeilside}>
            <Header />
            <Varsler />
            <React.Suspense fallback={<div />}>
                <Switch>
                    <Route path={Routes.Uautorisert}>
                        <IkkeLoggetInn />
                    </Route>
                    <ProtectedRoute path={Routes.Oversikt} exact>
                        <Oversikt />
                    </ProtectedRoute>
                    <ProtectedRoute path={Routes.Saksbilde}>
                        <Saksbilde />
                    </ProtectedRoute>
                    <ProtectedRoute path={Routes.Playground}>
                        <GraphQLPlayground />
                    </ProtectedRoute>
                    <Route path="*">
                        <PageNotFound />
                    </Route>
                </Switch>
            </React.Suspense>
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
