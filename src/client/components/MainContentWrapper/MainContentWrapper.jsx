import React, { useContext } from 'react';
import Nav from '../Nav';
import PersonBar from '../PersonBar';
import Fordeling from '../../routes/Fordeling';
import Sykepengegrunnlag from '../../routes/Sykepengegrunnlag';
import Utbetaling from '../../routes/Utbetaling';
import Oppsummering from '../../routes/Oppsummering';
import Sykdomsvilkår from '../../routes/Sykdomsvilkår';
import Inngangsvilkår from '../../routes/Inngangsvilkår';
import Sykmeldingsperiode from '../../routes/Sykmeldingsperiode';
import EmptyStateView from '../EmptyStateView';
import { Route } from 'react-router-dom';
import { PersonContext } from '../../context/PersonContext';
import './MainContentWrapper.css';
import Inntektskilder from '../../routes/Inntektskilder/Inntektskilder';

const MainContentWrapper = () => {
    const { personTilBehandling } = useContext(PersonContext);

    return (
        <>
            <PersonBar />
            <div className="page-content">
                <div className="LeftMenu">
                    <Nav active={personTilBehandling !== undefined} />
                </div>
                {personTilBehandling ? (
                    <div className="main-content">
                        <Route path={'/sykmeldingsperiode'} exact component={Sykmeldingsperiode} />
                        <Route path={'/sykdomsvilkår'} exact component={Sykdomsvilkår} />
                        <Route path={'/inngangsvilkår'} exact component={Inngangsvilkår} />
                        <Route path={'/inntektskilder'} exact component={Inntektskilder} />
                        <Route path={'/sykepengegrunnlag'} exact component={Sykepengegrunnlag} />
                        <Route path={'/fordeling'} exact component={Fordeling} />
                        <Route path={'/utbetaling'} exact component={Utbetaling} />
                        <Route path={'/oppsummering'} exact component={Oppsummering} />
                    </div>
                ) : (
                    <EmptyStateView />
                )}
            </div>
        </>
    );
};

export default MainContentWrapper;
