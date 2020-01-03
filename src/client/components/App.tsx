import React, { Suspense, useContext } from 'react';
import Oversikt from '../routes/Oversikt';
import HeaderBar from './HeaderBar';
import Saksbilde from './Saksbilde';
import { hot } from 'react-hot-loader';
import { AuthProvider } from '../context/AuthContext';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { SimuleringProvider } from '../context/SimuleringContext';
import { TildelingerProvider } from '../context/TildelingerContext';
import { withContextProviders } from '../context/withContextProviders';
import { SaksoversiktProvider } from '../context/SaksoversiktContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PersonContext, PersonProvider } from '../context/PersonContext';
import { EasterEggProvider, EasterEggContext } from '../context/EasterEggContext';
import './App.less';
import 'reset-css';

const Infotrygd = React.lazy(() => import('./Infotrygd'));

const App = withContextProviders(() => {
    useLogUserOut();
    const { personTilBehandling } = useContext(PersonContext);
    const { isActive: showInfotrygd } = useContext(EasterEggContext);

    if (showInfotrygd && personTilBehandling) {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Infotrygd />
            </Suspense>
        );
    }

    return (
        <BrowserRouter>
            <HeaderBar />
            <Switch>
                <Route path={'/'} exact component={Oversikt} />
                <Route component={Saksbilde} />
            </Switch>
        </BrowserRouter>
    );
}, [
    SimuleringProvider,
    SaksoversiktProvider,
    PersonProvider,
    AuthProvider,
    EasterEggProvider,
    TildelingerProvider
]);

export default hot(module)(App);
