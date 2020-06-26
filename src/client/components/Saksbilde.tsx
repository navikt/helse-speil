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
import NavFrontendSpinner from 'nav-frontend-spinner';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';
import Lenkeknapp from './Lenkeknapp';
import { TildelingerContext } from '../context/TildelingerContext';
import { Vedtaksperiode } from '../context/types.internal';
import { Scopes, useUpdateVarsler, useVarselFilter } from '../state/varslerState';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/authentication';

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

const TildelSpinner = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const TildelingVarsel = ({ tildeltTil, oppgavererefanse }: { tildeltTil?: string; oppgavererefanse: string }) => {
    const { email } = useRecoilValue(authState);
    const { tildelOppgave } = useContext(TildelingerContext);
    const { tildelPerson } = useContext(PersonContext);
    const [posting, setPosting] = useState(false);

    const tildel = () => {
        setPosting(true);
        tildelOppgave(oppgavererefanse, email!)
            .then(() => tildelPerson(email))
            .finally(() => setPosting(false));
    };

    return oppgavererefanse === undefined ? null : (
        <>
            {tildeltTil ? (
                tildeltTil !== email ? (
                    <Varsel type={Varseltype.Info}>
                        Saken er allerede tildelt til {capitalizeName(extractNameFromEmail(tildeltTil))}
                    </Varsel>
                ) : null
            ) : (
                <Varsel type={Varseltype.Info}>
                    Saken er ikke tildelt noen.&nbsp;<Lenkeknapp onClick={tildel}>Tildel meg</Lenkeknapp>
                    {posting && <TildelSpinner type="XS" />}
                </Varsel>
            )}
        </>
    );
};

const TomtSaksbilde = () => {
    const { isFetching: isFetchingPerson } = useContext(PersonContext);
    return (
        <>
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
    const { aktivVedtaksperiode, personTilBehandling, hentPerson } = useContext(PersonContext);
    const { tildelingError } = useContext(TildelingerContext);
    useVarselFilter(Scopes.SAKSBILDE);
    const { leggTilVarsel } = useUpdateVarsler();

    useEffect(() => {
        if (location.pathname.match(/\//g)!.length < 2) {
            leggTilVarsel({
                message: `'${location.pathname}' er ikke en gyldig URL.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
            return;
        }

        const sisteDelAvPath = location.pathname.match(/[^/]*$/)![0];
        const aktørId = sisteDelAvPath.match(/^\d{1,15}$/);
        if (!aktørId) {
            leggTilVarsel({
                message: `'${sisteDelAvPath}' er ikke en gyldig aktør-ID.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
            return;
        }
        if (!personTilBehandling || aktørId[0] !== personTilBehandling.aktørId) {
            hentPerson(aktørId[0]);
        }
    }, [location.pathname]);

    if (!personTilBehandling || !aktivVedtaksperiode) return <TomtSaksbilde />;

    const oppgavereferanse = (personTilBehandling.arbeidsgivere[0].vedtaksperioder.find(
        (v: Vedtaksperiode) => v.oppgavereferanse && v.oppgavereferanse !== 'null'
    ) as Vedtaksperiode)?.oppgavereferanse;

    return (
        <>
            <TildelingVarsel tildeltTil={personTilBehandling.tildeltTil} oppgavererefanse={oppgavereferanse} />
            {tildelingError && <Varsel type={Varseltype.Advarsel}>{tildelingError}</Varsel>}
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
