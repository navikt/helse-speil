import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Route, useParams } from 'react-router-dom';
import Vilkår from './Vilkår';
import Høyremeny from '../../components/Høyremeny';
import Sakslinje from '../../components/Sakslinje';
import Personlinje from '../../components/Personlinje';
import Venstremeny from '../../components/Venstremeny';
import Oppsummering from './Oppsummering';
import Inntektskilder from './Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from './Sykepengegrunnlag';
import { Sykmeldingsperiode } from './Sykmeldingsperiode/Sykmeldingsperiode';
import Utbetalingsoversikt from './Utbetalingsoversikt';
import LoggProvider from '../../context/LoggProvider';
import { PersonContext } from '../../context/PersonContext';
import { Location, useNavigation } from '../../hooks/useNavigation';
import Toppvarsler from '../../components/Toppvarsler';
import { Tidslinje } from '../../components/Tidslinje';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import Lenkeknapp from '../../components/Lenkeknapp';
import { useOppgavetildeling } from '../../hooks/useOppgavetildeling';
import { Arbeidsgiver, Vedtaksperiode } from '../../context/types.internal';
import { Scopes, useUpdateVarsler, useVarselFilter } from '../../state/varslerState';
import { useRecoilValue } from 'recoil';
import { authState } from '../../state/authentication';
import { KalkulererOverstyringToast } from './Sykmeldingsperiode/KalkulererOverstyringToast';

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

const SpinnerMedMarginTilVenstre = styled(NavFrontendSpinner)`
    margin-left: 1rem;
`;

const TildelingVarsel = ({ tildeltTil, oppgavererefanse }: { tildeltTil?: string; oppgavererefanse?: string }) => {
    const { email } = useRecoilValue(authState);
    const { tildelOppgave } = useOppgavetildeling();
    const { markerPersonSomTildelt } = useContext(PersonContext);
    const [posting, setPosting] = useState(false);

    const tildel = () => {
        if (!oppgavererefanse) return;
        setPosting(true);
        tildelOppgave(oppgavererefanse, email!)
            .then(() => markerPersonSomTildelt(email))
            .catch((assignedUser) => markerPersonSomTildelt(assignedUser))
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
                    {posting && <SpinnerMedMarginTilVenstre type="XS" />}
                </Varsel>
            )}
        </>
    );
};

const TomtSaksbilde = () => (
    <>
        <Sakslinje />
        <Container>
            <Venstremeny />
            <Høyremeny />
        </Container>
    </>
);

const useGyldigUrlVarsel = () => {
    const { leggTilVarsel } = useUpdateVarsler();
    useEffect(() => {
        if (location.pathname.match(/\//g)!.length < 2) {
            leggTilVarsel({
                message: `'${location.pathname}' er ikke en gyldig URL.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
        }
    }, [location.pathname]);
};

const useRefetchPersonOnUrlChange = () => {
    const { aktorId } = useParams();
    const { hentPerson, personTilBehandling } = useContext(PersonContext);
    const { leggTilVarsel } = useUpdateVarsler();

    useEffect(() => {
        const aktørId = aktorId.match(/^\d{1,15}$/);
        if (!aktørId) {
            leggTilVarsel({
                message: `'${aktorId}' er ikke en gyldig aktør-ID.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
            return;
        }
        if (aktorId !== personTilBehandling?.aktørId) {
            hentPerson(aktørId[0]);
        }
    }, [aktorId]);
};

const finnOppgavereferanse = ({ vedtaksperioder }: Arbeidsgiver): string | undefined =>
    (vedtaksperioder as Vedtaksperiode[]).find(
        ({ oppgavereferanse }) => oppgavereferanse && oppgavereferanse !== 'null'
    )?.oppgavereferanse;

const Saksbilde = () => {
    const { toString } = useNavigation();
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);
    const oppgavereferanse = personTilBehandling && finnOppgavereferanse(personTilBehandling.arbeidsgivere[0]);

    useVarselFilter(Scopes.SAKSBILDE);
    useGyldigUrlVarsel();
    useRefetchPersonOnUrlChange();

    if (!personTilBehandling || !aktivVedtaksperiode) return <TomtSaksbilde />;

    return (
        <>
            <TildelingVarsel tildeltTil={personTilBehandling.tildeltTil} oppgavererefanse={oppgavereferanse} />
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
            <KalkulererOverstyringToast />
        </>
    );
};

export default Saksbilde;
