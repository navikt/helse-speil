import React from 'react';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Toast } from './components/toasts/Toast';
import { Header } from './components/Header';
import { Routes } from './routes';
import { Varsler } from './components/Varsler';
import { RecoilRoot } from 'recoil';
import { useDebounce } from './hooks/useDebounce';
import { IkkeLoggetInn } from './routes/IkkeLoggetInn';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthentication } from './state/authentication';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useIsLoadingPerson } from './state/person';
import { hot } from 'react-hot-loader';
import 'reset-css';
import './App.less';

const Opptegnelse = React.lazy(() => import('./routes/saksbilde/Opptegnelse'));
const Saksbilde = React.lazy(() => import('./routes/saksbilde/Saksbilde'));
const Oversikt = React.lazy(() => import('./routes/oversikt'));

ReactModal.setAppElement('#root');

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const App = () => {
    useAuthentication();
    const isLoading = useIsLoadingPerson();
    const showToast = useDebounce(isLoading);

    return (
        <>
            <Toast isShowing={showToast}>
                Henter person
                <Spinner type="XS" />
            </Toast>
            <Header />
            <Varsler />
            <Switch>
                <React.Suspense fallback={<div />}>
                    <Route path={Routes.Uatutorisert}>
                        <IkkeLoggetInn />
                    </Route>
                    <ProtectedRoute path={Routes.Oversikt} exact>
                        <Oversikt />
                    </ProtectedRoute>
                    <ProtectedRoute path={Routes.Saksbilde}>
                        <Saksbilde />
                    </ProtectedRoute>
                    <ProtectedRoute path={Routes.OpptengelseTest}>
                        <Opptegnelse />
                    </ProtectedRoute>
                </React.Suspense>
            </Switch>
        </>
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
