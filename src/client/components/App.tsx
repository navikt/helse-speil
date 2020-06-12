import React, { useEffect } from 'react';
import Header from './Header';
import Saksbilde from './Saksbilde';
import { hot } from 'react-hot-loader';
import { Oversikt } from '../routes/Oversikt';
import { AuthProvider } from '../context/AuthContext';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { TildelingerProvider } from '../context/TildelingerContext';
import { withContextProviders } from '../context/withContextProviders';
import { BehovProvider } from '../context/BehovContext';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import { PersonProvider } from '../context/PersonContext';
import 'reset-css';
import './App.less';
import ProtectedRoute from './ProtectedRoute';
import IkkeLoggetInn from './IkkeLoggetInn';

const useResetLocationState = () => {
    const history = useHistory();
    useEffect(() => {
        history.replace('/');
    }, []);
};

const App = withContextProviders(
    React.memo(() => {
        useLogUserOut();
        useResetLocationState();

        return (
            <>
                <Header />
                <Switch>
                    <Route path={'/uautorisert'} component={IkkeLoggetInn} />
                    <ProtectedRoute path={'/'} exact component={Oversikt} />
                    <ProtectedRoute component={Saksbilde} />
                </Switch>
            </>
        );
    }),
    [BehovProvider, PersonProvider, AuthProvider, TildelingerProvider]
);

const WithRouting = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default hot(module)(WithRouting);
