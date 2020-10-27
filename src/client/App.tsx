import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Saksbilde from './routes/Saksbilde/Saksbilde';
import ReactModal from 'react-modal';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { hot } from 'react-hot-loader';
import { Toast } from './components/toasts/Toast';
import { Header } from './components/Header';
import { Routes } from './routes';
import { Varsler } from './components/Varsler';
import { Oversikt } from './routes/Oversikt';
import { RecoilRoot } from 'recoil';
import { useDebounce } from './hooks/useDebounce';
import { IkkeLoggetInn } from './routes/IkkeLoggetInn';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OppgaverProvider } from './context/OppgaverContext';
import { useAuthentication } from './state/authentication';
import { withContextProviders } from './context/withContextProviders';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonContext, PersonProvider } from './context/PersonContext';
import 'reset-css';
import './App.less';
import { TildelingTest } from './routes/TildelingTest';
import { SaksbildeV2 } from './routes/SaksbildeV2/SaksbildeV2';

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
                <ProtectedRoute path={Routes.TildelingTest}>
                    <TildelingTest />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.SaksbildeV2}>
                    <SaksbildeV2 />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Saksbilde}>
                    <Saksbilde />
                </ProtectedRoute>
            </Switch>
        </>
    );
}, [OppgaverProvider, PersonProvider]);

const withRoutingAndState = (Component: React.ComponentType) => () => (
    <BrowserRouter>
        <RecoilRoot>
            <Component />
        </RecoilRoot>
    </BrowserRouter>
);

export default hot(module)(withRoutingAndState(App));
