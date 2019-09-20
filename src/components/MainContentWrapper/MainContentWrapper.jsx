import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import Periode from '../pages/Periode/Periode';
import LeftMenu from '../LeftMenu/LeftMenu';
import Beregning from '../pages/Beregning/Beregning';
import Personinfo from '../Personinfo/Personinfo';
import Utbetaling from '../pages/Utbetaling/Utbetaling';
import Oppsummering from '../pages/Oppsummering/Oppsummering';
import Sykdomsvilkår from '../pages/Sykdomsvilkår/Sykdomsvilkår';
import Inngangsvilkår from '../pages/Inngangsvilkår/Inngangsvilkår';
import EmptyStateView from '../EmptyStateView';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import './MainContentWrapper.css';
import VelgBehandlingModal from './VelgBehandlingModal';

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
    }
);

export default MainContentWrapper;
