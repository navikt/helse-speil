import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
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
import { withBehandlingContext } from '../../context/BehandlingerContext';
import './MainContentWrapper.css';

const MainContentWrapper = withBehandlingContext(
    ({ behandlinger, behandling, setValgtBehandling }) => {
        const [modalOpen, setModalOpen] = useState(false);

        useEffect(() => {
            if (behandling === undefined && behandlinger?.length > 1) {
                setModalOpen(true);
            }
        }, [behandlinger, behandling]);

        const velgBehandling = behandling => {
            setModalOpen(false);
            setValgtBehandling(behandling);
        };

        return (
            <div className="page-content">
                {modalOpen && (
                    <VelgBehandlingModal
                        setModalOpen={setModalOpen}
                        behandlinger={behandlinger}
                        velgBehandling={velgBehandling}
                    />
                )}
                <LeftMenu
                    behandling={behandling}
                    behandlinger={behandlinger}
                    setValgtBehandling={setValgtBehandling}
                />
                {behandling ? (
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
    }
);

export default MainContentWrapper;
