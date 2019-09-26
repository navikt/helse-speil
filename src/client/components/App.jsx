import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { withContextProviders } from '../context/withContextProviders';
import { useLogUserOut } from '../hooks/useLogUserOut';
import Tilbakemeldinger from '../routes/HentTilbakemeldinger';
import { InnrapporteringProvider } from '../context/InnrapporteringContext';
import { BehandlingerProvider } from '../context/BehandlingerContext';
import { AuthProvider } from '../context/AuthContext';
import MainContentWrapper from './MainContentWrapper';
import HeaderBar from './HeaderBar';
import Oversikt from '../routes/Oversikt/Oversikt';
import './App.less';
import 'reset-css';

const App = withContextProviders(() => {
    useLogUserOut();

    return (
        <Router>
            <HeaderBar />
            <Switch>
                <Route path={'/tilbakemeldinger'} component={Tilbakemeldinger} exact />
                <Route path={'/'} exact component={Oversikt} />
                <Route component={MainContentWrapper} />
            </Switch>
        </Router>
    );
}, [InnrapporteringProvider, BehandlingerProvider, AuthProvider]);

export default App;
