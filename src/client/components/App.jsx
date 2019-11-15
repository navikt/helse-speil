import React, { Suspense, useContext } from 'react';
import Oversikt from '../routes/Oversikt/Oversikt';
import HeaderBar from './HeaderBar';
import Tilbakemeldinger from '../routes/HentTilbakemeldinger';
import MainContentWrapper from './MainContentWrapper';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { useLogUserOut } from '../hooks/useLogUserOut';
import { TildelingerProvider } from '../context/TildelingerContext';
import { withContextProviders } from '../context/withContextProviders';
import { SaksoversiktProvider } from '../context/SaksoversiktContext';
import { InnrapporteringProvider } from '../context/InnrapporteringContext';
import { PersonContext, PersonProvider } from '../context/PersonContext';
import { EasterEggProvider, EasterEggContext } from '../context/EasterEggContext';
import { SimuleringProvider } from '../context/SimuleringContext';
const Infotrygd = React.lazy(() => import('./Infotrygd'));
import './App.less';
import 'reset-css';

const App = withContextProviders(() => {
    useLogUserOut();
    const { personTilBehandling } = useContext(PersonContext);
    const { isActive } = useContext(EasterEggContext);

    if (isActive && personTilBehandling) {
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
                <Route path={'/tilbakemeldinger'} component={Tilbakemeldinger} exact />
                <Route path={'/'} exact component={Oversikt} />
                <Route component={MainContentWrapper} />
            </Switch>
        </BrowserRouter>
    );
}, [
    InnrapporteringProvider,
    SimuleringProvider,
    SaksoversiktProvider,
    PersonProvider,
    AuthProvider,
    EasterEggProvider,
    TildelingerProvider
]);

export default App;
