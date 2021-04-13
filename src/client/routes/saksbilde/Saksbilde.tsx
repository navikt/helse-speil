import React from 'react';
import styled from '@emotion/styled';
import { Flex, FlexColumn } from '../../components/Flex';
import { LasterTidslinje, Tidslinje } from '../../components/tidslinje';
import { LasterPersonlinje, Personlinje } from '../../components/Personlinje';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Vilkår } from './vilkår/Vilkår';
import { Utbetaling } from './utbetaling/Utbetaling';
import { Sykepengegrunnlag } from './sykepengegrunnlag/Sykepengegrunnlag';
import { Sykmeldingsperiode } from './sykmeldingsperiode/Sykmeldingsperiode';
import { Toppvarsler } from './toppvarsler/Toppvarsler';
import { LoggProvider } from './logg/LoggProvider';
import { LoggHeader as EksternLoggheader, LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';
import { Sakslinje } from './sakslinje/Sakslinje';
import { AmplitudeProvider } from './AmplitudeContext';
import { Scopes, useVarselFilter } from '../../state/varsler';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Person, UfullstendigVedtaksperiode, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { usePerson } from '../../state/person';
import { useRefreshPersonVedUrlEndring } from '../../hooks/useRefreshPersonVedUrlEndring';
import { useAktivPeriode } from '../../state/tidslinje';
import { Faresignaler } from './faresignaler/Faresignaler';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';
import { useRefreshPersonVedOpptegnelse } from '../../hooks/useRefreshPersonVedOpptegnelse';
import { usePollEtterOpptegnelser } from '../../io/polling';

import '@navikt/helse-frontend-logg/lib/main.css';
import { erTidslinjeperiode, Tidslinjeperiode, useMaksdato } from '../../modell/UtbetalingshistorikkElement';
import { useArbeidsgivernavn } from '../../modell/Arbeidsgiver';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: visible;
`;

const Content = styled.div`
    margin: 0 2rem;
    height: 100%;
`;

const LoggHeader = styled(EksternLoggheader)`
    width: 336px;
    box-sizing: border-box;
    box-shadow: inset 0 -1px 0 0 var(--navds-color-border);
    height: 75px;

    & > button {
        min-height: 75px;
    }
`;

const LoggListe = styled(EksternLoggliste)`
    width: 336px;
    box-sizing: border-box;
    border-top: none;

    .Sykmelding:before,
    .Søknad:before,
    .Inntektsmelding:before {
        position: absolute;
        font-size: 14px;
        border: 1px solid var(--navds-color-text-primary);
        color: var(--navds-color-text-primary);
        border-radius: 4px;
        width: 28px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
        box-sizing: border-box;
        left: 0;
    }

    .Sykmelding:before {
        content: 'SM';
    }

    .Søknad:before {
        content: 'SØ';
    }

    .Inntektsmelding:before {
        content: 'IM';
    }
`;

const SaksbildeContainer = styled.div`
    flex: auto;
`;

const LoggContainer = styled.div`
    border-left: 1px solid var(--navds-color-border);
`;

export const LasterSaksbilde = () => (
    <Container className="saksbilde" data-testid="laster-saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
    </Container>
);

const TomtSaksbilde = ({ person }: { person: Person }) => (
    <Container className="saksbilde" data-testid="tomt-saksbilde">
        <LoggProvider>
            <Personlinje person={person} />
            <Tidslinje person={person} />
            <Flex justifyContent="space-between">
                <Sakslinje aktivVedtaksperiode={false} />
                <LoggHeader />
            </Flex>
        </LoggProvider>
    </Container>
);

interface SaksbildeRevurderingProps {
    personTilBehandling: Person;
    aktivPeriode: Tidslinjeperiode;
}

const SaksbildeRevurdering = ({ personTilBehandling, aktivPeriode }: SaksbildeRevurderingProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer);
    const maksdato = useMaksdato(aktivPeriode.beregningId);
    return (
        <Container className="saksbilde" data-testid="tomt-saksbilde">
            <LoggProvider>
                <Personlinje person={personTilBehandling} />
                <Tidslinje person={personTilBehandling} />
                <Flex justifyContent="space-between">
                    <Sakslinje
                        aktivVedtaksperiode={false}
                        arbeidsgivernavn={arbeidsgivernavn}
                        arbeidsgiverOrgnr={aktivPeriode.organisasjonsnummer}
                        fom={aktivPeriode.fom}
                        tom={aktivPeriode.tom}
                        skjæringstidspunkt={undefined}
                        maksdato={maksdato}
                        over67År={undefined}
                    />
                    <LoggHeader />
                </Flex>
            </LoggProvider>
        </Container>
    );
};

interface SaksbildeVedtaksperiodeProps {
    personTilBehandling: Person;
    aktivVedtaksperiode: Vedtaksperiode;
    path: String;
}

const SaksbildeVedtaksperiode = ({ personTilBehandling, aktivVedtaksperiode, path }: SaksbildeVedtaksperiodeProps) => {
    const errorMelding = (error: Error) => {
        switch (aktivVedtaksperiode.tilstand) {
            case Vedtaksperiodetilstand.Venter:
                return (
                    <Varsel type={Varseltype.Info}>
                        Kunne ikke vise informasjon om vedtaksperioden. Dette skyldes at perioden ikke er klar til
                        behandling.
                    </Varsel>
                );
            case Vedtaksperiodetilstand.KunFerie:
                return (
                    <Varsel type={Varseltype.Info}>
                        Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun ferie.
                    </Varsel>
                );
            case Vedtaksperiodetilstand.KunPermisjon:
                return (
                    <Varsel type={Varseltype.Info}>
                        Kunne ikke vise informasjon om vedtaksperioden. Perioden inneholder kun permisjon.
                    </Varsel>
                );
            case Vedtaksperiodetilstand.IngenUtbetaling:
                return (
                    <Varsel type={Varseltype.Info}>
                        Kunne ikke vise informasjon om vedtaksperioden. Perioden har ingen utbetaling.
                    </Varsel>
                );
            case Vedtaksperiodetilstand.Ukjent:
                return (
                    <Varsel type={Varseltype.Feil}>
                        Kunne ikke vise informasjon om vedtaksperioden. Dette kan skyldes manglende data.
                    </Varsel>
                );
            default:
                return <Varsel type={Varseltype.Feil}>{error.message}</Varsel>;
        }
    };

    return (
        <Container className="saksbilde" data-testid="saksbilde">
            <Personlinje person={personTilBehandling} />
            <Switch>
                <Route path={`${path}/utbetalingshistorikk`}>
                    <Utbetalingshistorikk person={personTilBehandling} />
                </Route>
                <Route>
                    <Tidslinje person={personTilBehandling} />
                    <Flex justifyContent="space-between" style={{ width: '100vw' }} flex={1}>
                        <SaksbildeContainer>
                            <Sakslinje
                                aktivVedtaksperiode={true}
                                arbeidsgivernavn={aktivVedtaksperiode.arbeidsgivernavn}
                                arbeidsgiverOrgnr={aktivVedtaksperiode.inntektsgrunnlag.organisasjonsnummer}
                                fom={aktivVedtaksperiode.fom}
                                tom={aktivVedtaksperiode.tom}
                                skjæringstidspunkt={aktivVedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt}
                                maksdato={aktivVedtaksperiode.vilkår?.dagerIgjen.maksdato}
                                over67År={(aktivVedtaksperiode.vilkår?.alder.alderSisteSykedag ?? 0) >= 67}
                            />
                            <ErrorBoundary key={aktivVedtaksperiode.id} fallback={errorMelding}>
                                <AmplitudeProvider>
                                    <Flex style={{ flex: 1, height: 'calc(100% - 75px)' }}>
                                        <FlexColumn style={{ flex: 1, height: '100%' }}>
                                            <Toppvarsler vedtaksperiode={aktivVedtaksperiode} />
                                            <Content>
                                                <Switch>
                                                    <Route path={`${path}/utbetaling`}>
                                                        <Utbetaling />
                                                    </Route>
                                                    <Route path={`${path}/sykmeldingsperiode`}>
                                                        <Sykmeldingsperiode />
                                                    </Route>
                                                    <Route path={`${path}/vilkår`}>
                                                        <Vilkår
                                                            vedtaksperiode={aktivVedtaksperiode}
                                                            person={personTilBehandling}
                                                        />
                                                    </Route>
                                                    <Route path={`${path}/sykepengegrunnlag`}>
                                                        <Sykepengegrunnlag
                                                            vedtaksperiode={aktivVedtaksperiode}
                                                            person={personTilBehandling}
                                                        />
                                                    </Route>
                                                    {aktivVedtaksperiode.risikovurdering && (
                                                        <Route path={`${path}/faresignaler`}>
                                                            <Faresignaler
                                                                risikovurdering={aktivVedtaksperiode.risikovurdering}
                                                            />
                                                        </Route>
                                                    )}
                                                </Switch>
                                            </Content>
                                        </FlexColumn>
                                    </Flex>
                                </AmplitudeProvider>
                            </ErrorBoundary>
                        </SaksbildeContainer>
                        <LoggContainer>
                            <LoggHeader />
                            <LoggListe />
                        </LoggContainer>
                    </Flex>
                </Route>
            </Switch>
        </Container>
    );
};

const SaksbildeContent = () => {
    const aktivPeriode: Vedtaksperiode | UfullstendigVedtaksperiode | Tidslinjeperiode | undefined = useAktivPeriode();
    const personTilBehandling = usePerson();

    const { path } = useRouteMatch();

    usePollEtterOpptegnelser();
    useVarselFilter(Scopes.SAKSBILDE);
    useRefreshPersonVedUrlEndring();
    useRefreshPersonVedOpptegnelse();

    if (!personTilBehandling) return <LasterSaksbilde />;
    if (!aktivPeriode) return <TomtSaksbilde person={personTilBehandling} />;

    if (erTidslinjeperiode(aktivPeriode)) {
        return (
            <SaksbildeRevurdering
                personTilBehandling={personTilBehandling}
                aktivPeriode={aktivPeriode as Tidslinjeperiode}
            />
        );
    }
    return (
        <SaksbildeVedtaksperiode
            personTilBehandling={personTilBehandling}
            aktivVedtaksperiode={aktivPeriode as Vedtaksperiode}
            path={path}
        />
    );
};

export const Saksbilde = () => (
    <ErrorBoundary fallback={(error: Error) => <Varsel type={Varseltype.Advarsel}>{error.message}</Varsel>}>
        <React.Suspense fallback={<LasterSaksbilde />}>
            <LoggProvider>
                <SaksbildeContent />
            </LoggProvider>
        </React.Suspense>
    </ErrorBoundary>
);

export default Saksbilde;
