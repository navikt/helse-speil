import React, { useContext } from 'react';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Toast } from './components/toasts/Toast';
import { Header } from './components/Header';
import { Routes } from './routes';
import { Varsler } from './components/Varsler';
import { Oversikt } from './routes/Oversikt';
import { Saksbilde } from './routes/Saksbilde/Saksbilde';
import { RecoilRoot } from 'recoil';
import { Opptegnelse } from './routes/Saksbilde/Opptegnelse';
import { useDebounce } from './hooks/useDebounce';
import { IkkeLoggetInn } from './routes/IkkeLoggetInn';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthentication } from './state/authentication';
import { Utbetalingshistorikk } from './routes/Utbetalingshistorikk/Utbetalingshistorikk';
import { withContextProviders } from './context/withContextProviders';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonContext, PersonProvider } from './context/PersonContext';
import { Utbetalingshistorikk } from './routes/Utbetalingshistorikk/Utbetalingshistorikk';
import { hot } from 'react-hot-loader';
import 'reset-css';
import './App.less';

ReactModal.setAppElement('#root');

const Spinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const App = withContextProviders(() => {
    useAuthentication();
    const { isFetching } = useContext(PersonContext);

    const showToast = useDebounce(isFetching);

    return (
        <>
            <Toast isShowing={showToast}>
                Henter person
                <Spinner type="XS" />
            </Toast>
            <Header />
            <Varsler />
            <Switch>
                <Route path={Routes.Uatutorisert}>
                    <IkkeLoggetInn />
                </Route>
                <ProtectedRoute path={Routes.Oversikt} exact>
                    <Oversikt />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Utbetalingshistorikk}>
                    <Utbetalingshistorikk />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Saksbilde}>
                    <Saksbilde />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.OpptengelseTest}>
                    <Opptegnelse />
                </ProtectedRoute>
            </Switch>
        </>
    );
}, [PersonProvider]);

const withRoutingAndState = (Component: React.ComponentType) => () => (
    <BrowserRouter>
        <RecoilRoot>
            <Component />
        </RecoilRoot>
    </BrowserRouter>
);

export default hot(module)(withRoutingAndState(App));
