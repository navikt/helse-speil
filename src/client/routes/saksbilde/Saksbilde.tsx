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
import { Toppvarsler } from '../../components/Toppvarsler';
import { LoggProvider } from './logg/LoggProvider';
import { LoggHeader as EksternLoggheader, LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';
import { Sakslinje } from './sakslinje/Sakslinje';
import { KalkulererOverstyringToast } from './sykmeldingsperiode/KalkulererOverstyringToast';
import { AmplitudeProvider } from './AmplitudeContext';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Person } from 'internal-types';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { usePerson } from '../../state/person';
import { useRefreshPerson } from '../../hooks/useRefreshPerson';
import { useAktivVedtaksperiode } from '../../state/vedtaksperiode';
import '@navikt/helse-frontend-logg/lib/main.css';
import { Faresignaler } from './faresignaler/Faresignaler';
import { Utbetalingshistorikk } from './utbetalingshistorikk/Utbetalingshistorikk';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

const Content = styled.div`
    margin: 0 2rem;
    height: 100%;
`;

const LoggHeader = styled(EksternLoggheader)`
    width: 336px;
    box-sizing: border-box;
    border-left: 1px solid #c6c2bf;
    box-shadow: inset 0 -1px 0 0 #c6c2bf;
    height: 75px;

    & > button {
        min-height: 75px;
    }
`;

const LoggListe = styled(EksternLoggliste)`
    width: 336px;
    box-sizing: border-box;
    border-left: 1px solid #c6c2bf;
    border-top: none;

    .Sykmelding:before,
    .Søknad:before,
    .Inntektsmelding:before {
        position: absolute;
        font-size: 14px;
        border: 1px solid #59514b;
        color: #59514b;
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

export const LasterSaksbilde = () => (
    <Container className="saksbilde">
        <LasterPersonlinje />
        <LasterTidslinje />
    </Container>
);

const TomtSaksbilde = ({ person }: { person: Person }) => (
    <Container className="saksbilde">
        <LoggProvider>
            <Personlinje person={person} />
            <Tidslinje person={person} />
            <Flex justifyContent="space-between">
                <Sakslinje />
                <LoggHeader />
            </Flex>
        </LoggProvider>
    </Container>
);

const SaksbildeContent = () => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();
    const personTilBehandling = usePerson();
    const { path } = useRouteMatch();

    useVarselFilter(Scopes.SAKSBILDE);
    useRefreshPerson();

    if (!personTilBehandling) return <LasterSaksbilde />;
    if (!aktivVedtaksperiode) return <TomtSaksbilde person={personTilBehandling} />;

    return (
        <Container className="saksbilde">
            <Personlinje person={personTilBehandling} />
            <Switch>
                <Route path={`${path}/utbetalingshistorikk`}>
                    <Utbetalingshistorikk person={personTilBehandling} />
                </Route>
                <Route>
                    <Tidslinje person={personTilBehandling} aktivVedtaksperiode={aktivVedtaksperiode} />
                    <Flex justifyContent="space-between">
                        <Sakslinje />
                        <LoggHeader />
                    </Flex>
                    <ErrorBoundary fallback={(error: Error) => <Varsel type={Varseltype.Feil}>{error.message}</Varsel>}>
                        <AmplitudeProvider>
                            <Flex style={{ flex: 1 }}>
                                <FlexColumn style={{ flex: 1 }}>
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
                                <LoggListe />
                            </Flex>
                        </AmplitudeProvider>
                    </ErrorBoundary>
                    <KalkulererOverstyringToast />
                </Route>
            </Switch>
        </Container>
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
