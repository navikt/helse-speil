import React, { useContext } from 'react';
import Saksbilde from '../routes/Saksbilde/Saksbilde';
import { hot } from 'react-hot-loader';
import { Oversikt } from '../routes/Oversikt';
import { withContextProviders } from '../context/withContextProviders';
import { OppgaverProvider } from '../context/OppgaverContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonContext, PersonProvider } from '../context/PersonContext';
import 'reset-css';
import './App.less';
import ProtectedRoute from './ProtectedRoute';
import { IkkeLoggetInn } from '../routes/IkkeLoggetInn';
import { RecoilRoot } from 'recoil';
import { Varsler } from './Varsler';
import { useAuthentication } from '../state/authentication';
import { Header } from './Header';
import { Toast } from './toasts/Toast';
import styled from '@emotion/styled';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useDebounce } from '../hooks/useDebounce';
import { Routes } from '../routes';

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
                <Route path={Routes.Uatutorisert} component={IkkeLoggetInn} />
                <ProtectedRoute path={Routes.Oversikt} exact component={Oversikt} />
                <ProtectedRoute path={Routes.Saksbilde} component={Saksbilde} />
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
