import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import './MainContentWrapper.css';
import Sykdomsvilkår from '../pages/Sykdomsvilkår/Sykdomsvilkår';
import Nav from '../Nav/Nav';
import Personinfo from '../widgets/Personinfo/Personinfo';
import Inngangsvilkår from '../pages/Inngangsvilkår/Inngangsvilkår';
import Beregning from '../pages/Beregning/Beregning';
import Periode from '../pages/Periode/Periode';
import Utbetaling from '../pages/Utbetaling/Utbetaling';
import Oppsummering from '../pages/Oppsummering/Oppsummering';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import EmptyStateView from '../EmptyStateView';
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
                <Nav active={behandling !== undefined} />
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
