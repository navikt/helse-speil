import React, { useContext } from 'react';
import Oversikt from '../routes/Oversikt/Oversikt';
import HeaderBar from './HeaderBar';
import Infotrygd from './Infotrygd';
import Tilbakemeldinger from '../routes/HentTilbakemeldinger';
import MainContentWrapper from './MainContentWrapper';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { TildelingerProvider } from '../context/TildelingerContext';
import { withContextProviders } from '../context/withContextProviders';
import { PersonoversiktProvider } from '../context/PersonoversiktContext';
import { InnrapporteringProvider } from '../context/InnrapporteringContext';
import { PersonContext, PersonProvider } from '../context/PersonContext';
import { EasterEggProvider, EasterEggContext } from '../context/EasterEggContext';
import './App.less';
import 'reset-css';

const App = withContextProviders(() => {
    useLogUserOut();
    const { personTilBehandling } = useContext(PersonContext);
    const { isActive } = useContext(EasterEggContext);

    if (isActive && personTilBehandling) {
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
}, [
    InnrapporteringProvider,
    PersonoversiktProvider,
    PersonProvider,
    AuthProvider,
    EasterEggProvider,
    TildelingerProvider
]);

export default App;
