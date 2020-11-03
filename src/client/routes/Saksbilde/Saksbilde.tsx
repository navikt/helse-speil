import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Vilkår from './Vilkår';
import Sakslinje from '../../components/sakslinje/Sakslinje';
import Lenkeknapp from '../../components/Lenkeknapp';
import { Toppvarsler } from '../../components/Toppvarsler';
import LoggProvider from '../../context/logg/LoggProvider';
import Oppsummering from './Oppsummering';
import Inntektskilder from './Inntektskilder/Inntektskilder';
import Sykepengegrunnlag from './Sykepengegrunnlag';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Utbetalingsoversikt from './Utbetalingsoversikt';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Tidslinje } from '../../components/tidslinje';
import { authState } from '../../state/authentication';
import { Høyremeny } from '../../components/Høyremeny';
import { Personlinje } from '../../components/Personlinje';
import { Venstremeny } from '../../components/venstremeny';
import { PersonContext } from '../../context/PersonContext';
import { useRecoilValue } from 'recoil';
import { Route, useParams } from 'react-router-dom';
import { Sykmeldingsperiode } from './Sykmeldingsperiode/Sykmeldingsperiode';
import { useOppgavetildeling } from '../../hooks/useOppgavetildeling';
import { Location, useNavigation } from '../../hooks/useNavigation';
import { KalkulererOverstyringToast } from './Sykmeldingsperiode/KalkulererOverstyringToast';
import { Arbeidsgiver, Vedtaksperiode } from 'internal-types';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Scopes, useUpdateVarsler, useVarselFilter } from '../../state/varslerState';

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
        <Personlinje />
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
    const { hentPerson } = useContext(PersonContext);
    const { leggTilVarsel } = useUpdateVarsler();

    useEffect(() => {
        const aktørId = aktorId.match(/^\d{1,15}$/);
        if (!aktørId) {
            leggTilVarsel({
                message: `'${aktorId}' er ikke en gyldig aktør-ID.`,
                scope: Scopes.SAKSBILDE,
                type: Varseltype.Feil,
            });
        } else {
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
            <Personlinje person={personTilBehandling} />
            <Tidslinje person={personTilBehandling} aktivVedtaksperiode={aktivVedtaksperiode} />
            <LoggProvider>
                <Sakslinje />
                <Container>
                    <Venstremeny vedtaksperiode={aktivVedtaksperiode} />
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
