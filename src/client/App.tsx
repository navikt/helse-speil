import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Header } from './components/Header';
import { Routes } from './routes';
import { Varsler } from './components/Varsler';
import { RecoilRoot } from 'recoil';
import { useDebounce } from './hooks/useDebounce';
import { IkkeLoggetInn } from './routes/IkkeLoggetInn';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthentication } from './state/authentication';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useAnonymiserPerson, useIsLoadingPerson } from './state/person';
import { hot } from 'react-hot-loader';
import 'reset-css';
import './App.less';
import { Toasts } from './components/Toasts';
import { useAddToast, useRemoveToast } from './state/toasts';
import { nanoid } from 'nanoid';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalFeilside } from './GlobalFeilside';

const Opptegnelse = React.lazy(() => import('./routes/saksbilde/Opptegnelse'));
const Saksbilde = React.lazy(() => import('./routes/saksbilde/Saksbilde'));
const Oversikt = React.lazy(() => import('./routes/oversikt'));

ReactModal.setAppElement('#root');

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const useHenterPersonToast = (isLoading: boolean) => {
    const showToast = useDebounce(isLoading);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();

    useEffect(() => {
        const key = nanoid();
        if (showToast) {
            addToast({
                key: key,
                message: (
                    <>
                        Henter person <Spinner type="XS" />
                    </>
                ),
            });
        } else {
            removeToast(key);
        }
        return () => removeToast(key);
    }, [showToast]);
};

const App = () => {
    const isLoading = useIsLoadingPerson();
    useHenterPersonToast(isLoading);

    useAuthentication();
    const agurkmodusAktiv = localStorage.getItem('agurkmodus') === 'true';
    const anonymiserPerson = useAnonymiserPerson();
    anonymiserPerson(agurkmodusAktiv);

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
