import React from 'react';
import Oversikt from '../routes/Oversikt/Oversikt';
import HeaderBar from './HeaderBar';
import Tilbakemeldinger from '../routes/HentTilbakemeldinger';
import MainContentWrapper from './MainContentWrapper';
import { AuthProvider } from '../context/AuthContext';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { withContextProviders } from '../context/withContextProviders';
import { BehandlingerProvider } from '../context/BehandlingerContext';
import { InnrapporteringProvider } from '../context/InnrapporteringContext';
import './App.less';
import 'reset-css';

const App = withContextProviders(() => {
    useLogUserOut();

    return (
        <BrowserRouter>
            <HeaderBar />
            <Switch>
                <Route path={'/tilbakemeldinger'} component={Tilbakemeldinger} exact />
                <Route path={'/'} exact component={Oversikt} />
                <Route component={MainContentWrapper} />
            </Switch>
        </BrowserRouter>
    );
}, [InnrapporteringProvider, BehandlingerProvider, AuthProvider]);

export default App;
