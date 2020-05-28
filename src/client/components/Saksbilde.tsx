import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Route } from 'react-router-dom';
import Vilkår from '../routes/Vilkår';
import Høyremeny from './Høyremeny';
import Sakslinje from './Sakslinje';
import Personlinje from './Personlinje';
import Venstremeny from './Venstremeny';
import Oppsummering from '../routes/Oppsummering';
import Inntektskilder from '../routes/Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from '../routes/Sykepengegrunnlag';
import Sykmeldingsperiode from '../routes/Sykmeldingsperiode';
import Utbetalingsoversikt from '../routes/Utbetalingsoversikt';
import LoggProvider from '../context/LoggProvider';
import { PersonContext } from '../context/PersonContext';
import { Location, useNavigation } from '../hooks/useNavigation';
import Toppvarsler from './Toppvarsler';
import { Tidslinje } from './Tidslinje';
import { Error } from '../../types';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { TekniskVarsel } from './TekniskVarsel';

const Container = styled.div`
    display: flex;
    flex: 1;
    min-width: max-content;
    box-sizing: border-box;
`;

const Hovedinnhold = styled.div`
    flex: 1;
    overflow-x: scroll;
`;
const LasterInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: 2rem;
    height: 5rem;
    svg {
        margin: 0 0.6rem 0;
    }
`;

const TomtSaksbilde = ({ error }: { error?: Error }) => {
    const { isFetching: isFetchingPerson } = useContext(PersonContext);
    return (
        <>
            <TekniskVarsel error={error} />
            {isFetchingPerson && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter person
                </LasterInnhold>
            )}
            <Sakslinje />
            <Container>
                <Venstremeny />
                <Høyremeny />
            </Container>
        </>
    );
};

const Saksbilde = () => {
    const { toString } = useNavigation();
    const { aktivVedtaksperiode, personTilBehandling, hentPerson, error: personContextError } = useContext(
        PersonContext
    );
    const [error, setError] = useState<Error | undefined>(personContextError);

    useEffect(() => {
        setError(personContextError);
    }, [personContextError]);

    useEffect(() => {
        if (location.pathname.match(/\//g)!.length < 2) {
            setError({ statusCode: 1, message: `'${location.pathname}' er ikke en gyldig URL.` });
            return;
        }

        const sisteDelAvPath = location.pathname.match(/[^/]*$/)![0];
        const aktørId = sisteDelAvPath.match(/^\d{1,15}$/);
        if (!aktørId) {
            setError({ statusCode: 1, message: `'${sisteDelAvPath}' er ikke en gyldig aktør-ID.` });
            return;
        }
        if (!personTilBehandling || aktørId[0] !== personTilBehandling.aktørId) {
            hentPerson(aktørId[0]);
        }
    }, [location.pathname]);

    if (!personTilBehandling || !aktivVedtaksperiode) return <TomtSaksbilde error={error} />;

    return (
        <>
            <TekniskVarsel error={error} />
            <Personlinje />
            <Tidslinje />
            <LoggProvider>
                <Sakslinje />
                <Container>
                    <Venstremeny />
                    <Hovedinnhold>
                        <Toppvarsler />
                        <Route
                            path={`${toString(Location.Sykmeldingsperiode)}/:fodselsnummer`}
                            component={Sykmeldingsperiode}
                        />
                        <Route path={`${toString(Location.Vilkår)}/:fodselsnummer`} component={Vilkår} />
                        <Route
                            path={`${toString(Location.Inntektskilder)}/:fodselsnummer`}
                            component={Inntektskilder}
                        />
                        <Route
                            path={`${toString(Location.Sykepengegrunnlag)}/:fodselsnummer`}
                            component={Sykepengegrunnlag}
                        />
                        <Route
                            path={`${toString(Location.Utbetalingsoversikt)}/:fodselsnummer`}
                            component={Utbetalingsoversikt}
                        />
                        <Route path={`${toString(Location.Oppsummering)}/:fodselsnummer`} component={Oppsummering} />
                    </Hovedinnhold>
                    <Høyremeny />
                </Container>
            </LoggProvider>
        </>
    );
};

export default Saksbilde;
