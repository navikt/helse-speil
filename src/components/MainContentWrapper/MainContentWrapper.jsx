import React, { useEffect, useState } from 'react';
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

        const behandlingerForAktør = behandlinger.filter(
            b => b.originalSøknad.aktorId === behandling.originalSøknad.aktorId
        );

        return (
            <div className="page-content">
                {modalOpen && (
                    <VelgBehandlingModal
                        setModalOpen={setModalOpen}
                        behandlinger={behandlingerForAktør}
                        velgBehandling={velgBehandling}
                    />
                )}
                <LeftMenu
                    behandlinger={behandlinger}
                    setValgtBehandling={setValgtBehandling}
                    behandling={behandling}
                />
                {behandling ? (
                    <div className="main-content">
                        <Personinfo />
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
