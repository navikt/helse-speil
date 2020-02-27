import React, { useContext } from 'react';
import Nav from '../Nav';
import PersonBar from '../PersonBar';
import Fordeling from '../../routes/Fordeling';
import Oppfølging from '../../routes/Oppfølging';
import Oppsummering from '../../routes/Oppsummering';
import Inngangsvilkår from '../../routes/Inngangsvilkår';
import EmptyStateView from '../EmptyStateView';
import Inntektskilder from '../../routes/Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from '../../routes/Sykepengegrunnlag';
import Sykmeldingsperiode from '../../routes/Sykmeldingsperiode';
import Utbetalingsoversikt from '../../routes/Utbetalingsoversikt';
import { Route } from 'react-router-dom';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import './Saksbilde.less';
import Tidslinje from '../Tidslinje';
import styled from '@emotion/styled';

const Høyremeny = styled.div`
    flex: 1;
    width: 16rem;
    max-width: 16rem;
    border-left: 1px solid #c6c2bf;
`;

const Saksbilde = () => {
    const { personTilBehandling } = useContext(PersonContext);

    return (
        <>
            <PersonBar />
            <Tidslinje />
            <div className="Saksbilde">
                <Nav />
                {personTilBehandling ? (
                    <div className="Saksbilde__content">
                        <Route
                            path={`/${pages.SYKMELDINGSPERIODE}/:aktoerId`}
                            component={Sykmeldingsperiode}
                        />
                        <Route path={`/${pages.OPPFØLGING}/:aktoerId`} component={Oppfølging} />
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
                <Høyremeny />
            </div>
        </>
    );
};

export default Saksbilde;
