import React from 'react';
import styled from '@emotion/styled';
import { Flex, FlexColumn } from '../../../components/Flex';
import { Tidslinje } from '../../../components/tidslinje';
import { Personlinje } from '../../../components/Personlinje';
import { Route, Switch } from 'react-router-dom';
import { Vilkår } from '../vilkår/Vilkår';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Sykmeldingsperiode } from '../sykmeldingsperiode/Sykmeldingsperiode';
import { Toppvarsler } from '../toppvarsler/Toppvarsler';
import { LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { AmplitudeProvider } from '../AmplitudeContext';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Utbetalingshistorikk } from '../utbetalingshistorikk/Utbetalingshistorikk';

import '@navikt/helse-frontend-logg/lib/main.css';
import { LoggHeader, SaksbildeContainer } from '../Saksbilde';

interface SaksbildeVedtaksperiodeProps {
    personTilBehandling: Person;
    aktivVedtaksperiode: Vedtaksperiode;
    path: String;
}

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

const AutoFlexContainer = styled.div`
    flex: auto;
`;

const LoggContainer = styled.div`
    border-left: 1px solid var(--navds-color-border);
`;

const Content = styled.div`
    margin: 0 2rem;
    height: 100%;
`;

export const SaksbildeVedtaksperiode = ({
    personTilBehandling,
    aktivVedtaksperiode,
    path,
}: SaksbildeVedtaksperiodeProps) => {
    const errorMelding = getErrorMelding(aktivVedtaksperiode.tilstand);

    const fom = aktivVedtaksperiode.fom;
    const tom = aktivVedtaksperiode.tom;
    const arbeidsgivernavn = aktivVedtaksperiode.arbeidsgivernavn;
    const organisasjonsnummer = aktivVedtaksperiode.inntektsgrunnlag.organisasjonsnummer;
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt;
    const maksdato = aktivVedtaksperiode.vilkår?.dagerIgjen.maksdato;
    const over67år = (aktivVedtaksperiode.vilkår?.alder.alderSisteSykedag ?? 0) >= 67;

    return (
        <SaksbildeContainer className="saksbilde" data-testid="saksbilde-vedtaksperiode">
            <Personlinje person={personTilBehandling} />
            <Switch>
                <Route path={`${path}/utbetalingshistorikk`}>
                    <Utbetalingshistorikk person={personTilBehandling} />
                </Route>
                <Route>
                    <Tidslinje person={personTilBehandling} />
                    <Flex justifyContent="space-between" style={{ width: '100vw' }} flex={1}>
                        <AutoFlexContainer>
                            <ErrorBoundary key={aktivVedtaksperiode.id} fallback={errorMelding}>
                                <Sakslinje
                                    aktivVedtaksperiode={true}
                                    arbeidsgivernavn={arbeidsgivernavn}
                                    arbeidsgiverOrgnr={organisasjonsnummer}
                                    fom={fom}
                                    tom={tom}
                                    skjæringstidspunkt={skjæringstidspunkt}
                                    maksdato={maksdato}
                                    over67År={over67år}
                                />
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
                        </AutoFlexContainer>
                        <LoggContainer>
                            <LoggHeader />
                            <LoggListe />
                        </LoggContainer>
                    </Flex>
                </Route>
            </Switch>
        </SaksbildeContainer>
    );
};

const getErrorMelding = (tilstand: Vedtaksperiodetilstand) => {
    return (error: Error) => {
        switch (tilstand) {
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
};
