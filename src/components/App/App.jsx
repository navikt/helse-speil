import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import Tilbakemeldinger from '../pages/HentTilbakemeldinger/HentTilbakemeldinger';
import HeaderBar from '../HeaderBar/HeaderBar';
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper';
import { BehandlingerProvider } from '../../context/BehandlingerContext';
import { InnrapporteringProvider } from '../../context/InnrapporteringContext';
import { AuthProvider } from '../../context/AuthContext';
import { withContextProviders } from '../../context/withContextProviders';
import { useLogUserOut } from '../../hooks/useLogUserOut';
import './App.less';
import 'reset-css';
import Oversikt from '../pages/Oversikt/Oversikt';

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
