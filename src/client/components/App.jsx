import React, { useContext } from 'react';
import Oversikt from '../routes/Oversikt/Oversikt';
import HeaderBar from './HeaderBar';
import Tilbakemeldinger from '../routes/HentTilbakemeldinger';
import MainContentWrapper from './MainContentWrapper';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { withContextProviders } from '../context/withContextProviders';
import { BehandlingerProvider } from '../context/BehandlingerContext';
import { InnrapporteringProvider } from '../context/InnrapporteringContext';
import './App.less';
import 'reset-css';
import Infotrygd from './Infotrygd';
import { EasterEggProvider, EasterEggContext } from '../context/EasterEggContext';

const App = withContextProviders(() => {
    useLogUserOut();

    const { isActive } = useContext(EasterEggContext);

    if (isActive) {
        return <Infotrygd />;
    }

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
}, [InnrapporteringProvider, BehandlingerProvider, AuthProvider, EasterEggProvider]);

export default App;
