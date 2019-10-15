import React, { useContext } from 'react';
import PersonBar from '../PersonBar';
import LeftMenu from '../LeftMenu';
import Periode from '../../routes/Periode';
import Beregning from '../../routes/Beregning';
import Utbetaling from '../../routes/Utbetaling';
import Oppsummering from '../../routes/Oppsummering';
import Sykdomsvilkår from '../../routes/Sykdomsvilkår';
import Inngangsvilkår from '../../routes/Inngangsvilkår';
import Sykmeldingsperiode from '../../routes/Sykmeldingsperiode';
import EmptyStateView from '../EmptyStateView';
import { Route } from 'react-router-dom';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import './MainContentWrapper.css';

const MainContentWrapper = () => {
    const { velgBehandling, valgtBehandling, behandlinger } = useContext(BehandlingerContext);

    return (
        <div className="page-content">
            <LeftMenu
                behandling={valgtBehandling}
                behandlinger={behandlinger}
                onSelectItem={behandling => velgBehandling(behandling)}
            />
            {valgtBehandling ? (
                <div className="main-content">
                    <PersonBar />
                    <Route path={'/sykmeldingsperiode'} exact component={Sykmeldingsperiode} />
                    <Route path={'/sykdomsvilkår'} exact component={Sykdomsvilkår} />
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
};

export default MainContentWrapper;
