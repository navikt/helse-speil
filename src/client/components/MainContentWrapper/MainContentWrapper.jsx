import React, { useContext, useEffect, useState } from 'react';
import PersonBar from '../PersonBar';
import LeftMenu from '../LeftMenu';
import Periode from '../../routes/Periode';
import Beregning from '../../routes/Beregning';
import Utbetaling from '../../routes/Utbetaling';
import Oppsummering from '../../routes/Oppsummering';
import Sykdomsvilkår from '../../routes/Sykdomsvilkår';
import Inngangsvilkår from '../../routes/Inngangsvilkår';
import EmptyStateView from '../EmptyStateView';
import VelgBehandlingModal from './VelgBehandlingModal';
import { Route } from 'react-router-dom';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import './MainContentWrapper.css';

const MainContentWrapper = () => {
    const { userMustSelectBehandling, velgBehandling, valgtBehandling, state } = useContext(
        BehandlingerContext
    );
    const { behandlinger } = state;
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (userMustSelectBehandling) {
            setModalOpen(true);
        }
    }, [userMustSelectBehandling]);

    const lukkModalOgVelgBehandling = valgtBehandling => {
        setModalOpen(false);
        velgBehandling(valgtBehandling);
    };

    return (
        <div className="page-content">
            {modalOpen && (
                <VelgBehandlingModal
                    setModalOpen={setModalOpen}
                    behandlinger={behandlinger}
                    onSelectItem={lukkModalOgVelgBehandling}
                />
            )}
            <LeftMenu
                behandling={valgtBehandling}
                behandlinger={behandlinger}
                onSelectItem={lukkModalOgVelgBehandling}
            />
            {valgtBehandling ? (
                <div className="main-content">
                    <PersonBar />
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
