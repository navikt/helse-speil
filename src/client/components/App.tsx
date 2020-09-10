import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Saksbilde from '../routes/Saksbilde/Saksbilde';
import ReactModal from 'react-modal';
import ProtectedRoute from './ProtectedRoute';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { hot } from 'react-hot-loader';
import { Toast } from './toasts/Toast';
import { Header } from './Header';
import { Routes } from '../routes';
import { Varsler } from './Varsler';
import { Oversikt } from '../routes/Oversikt';
import { RecoilRoot } from 'recoil';
import { useDebounce } from '../hooks/useDebounce';
import { IkkeLoggetInn } from '../routes/IkkeLoggetInn';
import { OppgaverProvider } from '../context/OppgaverContext';
import { useAuthentication } from '../state/authentication';
import { withContextProviders } from '../context/withContextProviders';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonContext, PersonProvider } from '../context/PersonContext';
import './App.less';
import 'reset-css';

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
