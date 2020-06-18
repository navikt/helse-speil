import React from 'react';
import Header from './Header';
import Saksbilde from './Saksbilde';
import { hot } from 'react-hot-loader';
import { Oversikt } from '../routes/Oversikt';
import { TildelingerProvider } from '../context/TildelingerContext';
import { withContextProviders } from '../context/withContextProviders';
import { BehovProvider } from '../context/BehovContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonProvider } from '../context/PersonContext';
import 'reset-css';
import './App.less';
import ProtectedRoute from './ProtectedRoute';
import IkkeLoggetInn from './IkkeLoggetInn';
import { RecoilRoot } from 'recoil';
import { Varsler } from './Varsler';
import { useAuthentication } from '../state/authentication';

const App = withContextProviders(
    React.memo(() => {
        useAuthentication();

        return (
            <>
                <Header />
                <Varsler />
                <Switch>
                    <Route path={'/uautorisert'} component={IkkeLoggetInn} />
                    <ProtectedRoute path={'/'} exact component={Oversikt} />
                    <ProtectedRoute component={Saksbilde} />
                </Switch>
            </>
        );
    }),
    [BehovProvider, PersonProvider, TildelingerProvider]
);

const WithRouting = () => (
    <BrowserRouter>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </BrowserRouter>
);

export default hot(module)(WithRouting);
