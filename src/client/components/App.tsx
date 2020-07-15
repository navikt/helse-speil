import React from 'react';
import Saksbilde from '../routes/Saksbilde/Saksbilde';
import { hot } from 'react-hot-loader';
import { Oversikt } from '../routes/Oversikt';
import { withContextProviders } from '../context/withContextProviders';
import { OppgaverProvider } from '../context/OppgaverContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonProvider } from '../context/PersonContext';
import 'reset-css';
import './App.less';
import ProtectedRoute from './ProtectedRoute';
import { IkkeLoggetInn } from '../routes/IkkeLoggetInn';
import { RecoilRoot } from 'recoil';
import { Varsler } from './Varsler';
import { useAuthentication } from '../state/authentication';
import { Header } from './Header';

const App = withContextProviders(() => {
    useAuthentication();

    return (
        <>
            <Header />
            <Varsler />
            <Switch>
                <Route path="/uautorisert" component={IkkeLoggetInn} />
                <ProtectedRoute path="/" exact component={Oversikt} />
                <ProtectedRoute path="/*/:aktorId" component={Saksbilde} />
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
