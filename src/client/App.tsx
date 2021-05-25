import React from 'react';
import { hot } from 'react-hot-loader';
import ReactModal from 'react-modal';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'reset-css';

import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toasts } from './components/Toasts';
import { Varsler } from './components/Varsler';
import { useLoadingToast } from './hooks/useLoadingToast';
import { IkkeLoggetInn } from './routes/IkkeLoggetInn';
import { useAuthentication } from './state/authentication';
import { useIsLoadingPerson } from './state/person';

import './App.less';
import { GlobalFeilside } from './GlobalFeilside';
import { Routes } from './routes';

const Opptegnelse = React.lazy(() => import('./routes/saksbilde/Opptegnelse'));
const Saksbilde = React.lazy(() => import('./routes/saksbilde/Saksbilde'));
const Oversikt = React.lazy(() => import('./routes/oversikt'));

ReactModal.setAppElement('#root');

const App = () => {
    useLoadingToast({ isLoading: useIsLoadingPerson(), message: 'Henter person' });
    useAuthentication();

    return (
        <ErrorBoundary fallback={GlobalFeilside}>
            <Header />
            <Varsler />
            <Switch>
                <React.Suspense fallback={<div />}>
                    <Route path={Routes.Uautorisert}>
                        <IkkeLoggetInn />
                    </Route>
                    <ProtectedRoute path={Routes.Oversikt} exact>
                        <Oversikt />
                    </ProtectedRoute>
                    <ProtectedRoute path={Routes.Saksbilde}>
                        <Saksbilde />
                    </ProtectedRoute>
                    <ProtectedRoute path={Routes.OpptegnelseTest}>
                        <Opptegnelse />
                    </ProtectedRoute>
                </React.Suspense>
            </Switch>
            <Toasts />
        </ErrorBoundary>
    );
};

const withRoutingAndState = (Component: React.ComponentType) => () => (
    <BrowserRouter>
        <RecoilRoot>
            <Component />
        </RecoilRoot>
    </BrowserRouter>
);

export default hot(module)(withRoutingAndState(App));
