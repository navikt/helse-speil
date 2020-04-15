import React from 'react';
import Oversikt from '../routes/Oversikt';
import HeaderBar from './HeaderBar';
import Saksbilde from './Saksbilde';
import { hot } from 'react-hot-loader';
import { AuthProvider } from '../context/AuthContext';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { TildelingerProvider } from '../context/TildelingerContext';
import { withContextProviders } from '../context/withContextProviders';
import { BehovoversiktProvider } from '../context/SaksoversiktContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonProvider } from '../context/PersonContext';
import 'reset-css';
import './App.less';
import ProtectedRoute from './ProtectedRoute';
import IkkeLoggetInn from './IkkeLoggetInn';

const App = withContextProviders(() => {
    useLogUserOut();

    return (
        <BrowserRouter>
            <HeaderBar />
            <Switch>
                <Route path={'/uautorisert'} component={IkkeLoggetInn} />
                <ProtectedRoute path={'/'} exact component={Oversikt} />
                <ProtectedRoute component={Saksbilde} />
            </Switch>
        </BrowserRouter>
    );
}, [BehovoversiktProvider, PersonProvider, AuthProvider, TildelingerProvider]);

export default hot(module)(App);
