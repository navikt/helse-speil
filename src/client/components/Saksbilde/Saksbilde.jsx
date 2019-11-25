import React, { useContext } from 'react';
import Nav from '../Nav';
import PersonBar from '../PersonBar';
import Fordeling from '../../routes/Fordeling';
import Oppsummering from '../../routes/Oppsummering';
import Sykdomsvilkår from '../../routes/Sykdomsvilkår';
import Inngangsvilkår from '../../routes/Inngangsvilkår';
import EmptyStateView from '../EmptyStateView';
import Inntektskilder from '../../routes/Inntektskilder';
import Sykepengegrunnlag from '../../routes/Sykepengegrunnlag';
import Sykmeldingsperiode from '../../routes/Sykmeldingsperiode';
import Utbetalingsoversikt from '../../routes/Utbetalingsoversikt';
import { Route } from 'react-router-dom';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import './Saksbilde.less';

const Saksbilde = () => {
    const { personTilBehandling } = useContext(PersonContext);

    return (
        <>
            <PersonBar />
            <div className="Saksbilde">
                <Nav active={personTilBehandling !== undefined} />
                {personTilBehandling ? (
                    <div className="Saksbilde__content">
                        <Route
                            path={`/${pages.SYKMELDINGSPERIODE}/:aktoerId`}
                            component={Sykmeldingsperiode}
                        />
                        <Route
                            path={`/${pages.SYKDOMSVILKÅR}/:aktoerId`}
                            component={Sykdomsvilkår}
                        />
                        <Route
                            path={`/${pages.INNGANGSVILKÅR}/:aktoerId`}
                            component={Inngangsvilkår}
                        />
                        <Route
                            path={`/${pages.INNTEKTSKILDER}/:aktoerId`}
                            component={Inntektskilder}
                        />
                        <Route
                            path={`/${pages.SYKEPENGEGRUNNLAG}/:aktoerId`}
                            component={Sykepengegrunnlag}
                        />
                        <Route path={`/${pages.FORDELING}/:aktoerId`} component={Fordeling} />
                        <Route
                            path={`/${pages.UTBETALINGSOVERSIKT}/:aktoerId`}
                            component={Utbetalingsoversikt}
                        />
                        <Route path={`/${pages.OPPSUMMERING}/:aktoerId`} component={Oppsummering} />
                    </div>
                ) : (
                    <EmptyStateView />
                )}
            </div>
        </>
    );
};

export default Saksbilde;
