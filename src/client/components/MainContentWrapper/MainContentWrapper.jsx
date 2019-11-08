import React, { useContext } from 'react';
import Nav from '../Nav';
import { pages } from '../../hooks/useLinks';
import PersonBar from '../PersonBar';
import Fordeling from '../../routes/Fordeling';
import Sykepengegrunnlag from '../../routes/Sykepengegrunnlag';
import Utbetalingsoversikt from '../../routes/Utbetalingsoversikt';
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
                        <Route
                            path={`/${pages.SYKMELDINGSPERIODE}/:aktoerId`}
                            exact
                            component={Sykmeldingsperiode}
                        />
                        <Route
                            path={`/${pages.SYKDOMSVILKÅR}/:aktoerId`}
                            exact
                            component={Sykdomsvilkår}
                        />
                        <Route
                            path={`/${pages.INNGANGSVILKÅR}/:aktoerId`}
                            exact
                            component={Inngangsvilkår}
                        />
                        <Route
                            path={`/${pages.INNTEKTSKILDER}/:aktoerId`}
                            exact
                            component={Inntektskilder}
                        />
                        <Route
                            path={`/${pages.SYKEPENGEGRUNNLAG}/:aktoerId`}
                            exact
                            component={Sykepengegrunnlag}
                        />
                        <Route path={`/${pages.FORDELING}/:aktoerId`} exact component={Fordeling} />
                        <Route
                            path={`/${pages.UTBETALINGSOVERSIKT}/:aktoerId`}
                            exact
                            component={Utbetalingsoversikt}
                        />
                        <Route
                            path={`/${pages.OPPSUMMERING}/:aktoerId`}
                            exact
                            component={Oppsummering}
                        />
                    </div>
                ) : (
                    <EmptyStateView />
                )}
            </div>
        </>
    );
};

export default MainContentWrapper;
