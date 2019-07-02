import React from 'react';
import { Route } from 'react-router-dom';
import './MainContentWrapper.css';
import Sykdomsvilkår from '../pages/Sykdomsvilkår/Sykdomsvilkår';
import Nav from '../Nav/NavView';
import Personinfo from '../widgets/Personinfo/Personinfo';
import Inngangsvilkår from '../pages/Inngangsvilkår/Inngangsvilkår';
import Beregning from '../pages/Beregning/Beregning';
import Periode from '../pages/Periode/Periode';
import Utbetaling from '../pages/Utbetaling/Utbetaling';
import Oppsummering from '../pages/Oppsummering/Oppsummering';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import EmptyStateView from '../EmptyStateView';
import Informasjonspanel from '../saksbehandling/Informasjonspanel/Informasjonspanel';

const MainContentWrapper = withBehandlingContext(({ behandling }) => {
    if (!behandling) {
        return <EmptyStateView />;
    }

    return (
        <div className="page-content">
            <Nav />
            <div className="main-content">
                <Personinfo />
                <Informasjonspanel />
                <Route path={'/'} exact component={Sykdomsvilkår} />
                <Route
                    path={'/inngangsvilkår'}
                    exact
                    component={Inngangsvilkår}
                />
                <Route path={'/beregning'} exact component={Beregning} />
                <Route path={'/periode'} exact component={Periode} />
                <Route path={'/utbetaling'} exact component={Utbetaling} />
                <Route path={'/oppsummering'} exact component={Oppsummering} />
            </div>
        </div>
    );
});

export default MainContentWrapper;
