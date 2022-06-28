import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';
import './App.css';

import { Toasts } from '@components/Toasts';
import { Header } from '@components/header/Header';
import { Varsler } from '@components/Varsler';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { useFetchErrors, usePersonLoadable } from '@state/person';
import { useAddVarsel, useSetVarsler } from '@state/varsler';
import { useEasterEggIsActive } from '@state/easterEgg';
import { useAuthentication } from '@state/authentication';
import { onLazyLoadFail } from '@utils/error';
import { isFetchErrorArray } from '@io/graphql/errors';

import { PageNotFound } from './PageNotFound';
import { IkkeLoggetInn } from './IkkeLoggetInn';
import { GlobalFeilside } from './GlobalFeilside';
import { Routes } from './index';

const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde').catch(onLazyLoadFail));
const Oversikt = React.lazy(() => import('./oversikt').catch(onLazyLoadFail));
const Agurk = React.lazy(() => import('../components/Agurk').catch(onLazyLoadFail));
const GraphQLPlayground = React.lazy(() => import('./playground/GraphQLPlayground').catch(onLazyLoadFail));

ReactModal.setAppElement('#root');

const useSyncFetchAlerts = () => {
    const fetchErrors = useFetchErrors();
    const addAlert = useAddVarsel();

    useEffect(() => {
        if (isFetchErrorArray(fetchErrors)) {
            for (const error of fetchErrors) {
                addAlert(error);
            }
        }
    }, [fetchErrors]);
};

const useSyncAlertsToLocation = () => {
    const location = useLocation();
    const setVarsler = useSetVarsler();

    useEffect(() => {
        setVarsler((prevState) => prevState.filter((it) => it.scope === location.pathname));
    }, [location]);
};

const App = () => {
    useLoadingToast({ isLoading: usePersonLoadable().state === 'loading', message: 'Henter person' });
    useAuthentication();

    const easterEggIsActive = useEasterEggIsActive();

    useSyncFetchAlerts();
    useSyncAlertsToLocation();

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
