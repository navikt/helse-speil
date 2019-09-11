import React from 'react';
import { Route } from 'react-router-dom';
import Periode from '../pages/Periode/Periode';
import LeftMenu from '../LeftMenu/LeftMenu';
import Beregning from '../pages/Beregning/Beregning';
import Personinfo from '../widgets/Personinfo/Personinfo';
import Utbetaling from '../pages/Utbetaling/Utbetaling';
import Oppsummering from '../pages/Oppsummering/Oppsummering';
import Sykdomsvilkår from '../pages/Sykdomsvilkår/Sykdomsvilkår';
import Inngangsvilkår from '../pages/Inngangsvilkår/Inngangsvilkår';
import EmptyStateView from '../EmptyStateView';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import './MainContentWrapper.css';

const MainContentWrapper = withBehandlingContext(({ behandling }) => {
    return (
        <div className="page-content">
            <LeftMenu behandling={behandling} />
            {behandling ? (
                <div className="main-content">
                    <Personinfo />
                    <Route path={'/'} exact component={Sykdomsvilkår} />
                    <Route path={'/inngangsvilkår'} exact component={Inngangsvilkår} />
                    <Route path={'/beregning'} exact component={Beregning} />
                    <Route path={'/periode'} exact component={Periode} />
                    <Route path={'/utbetaling'} exact component={Utbetaling} />
                    <Route path={'/oppsummering'} exact component={Oppsummering} />
                </div>
            ) : (
                <EmptyStateView />
            )}
        </div>
    );
});

export default MainContentWrapper;
