import styled from '@emotion/styled';
import { Person, Vedtaksperiode } from 'internal-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LoggListe as EksternLoggliste } from '@navikt/helse-frontend-logg';
import '@navikt/helse-frontend-logg/lib/main.css';

import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { useArbeidsforhold, useArbeidsgivernavn, useOrganisasjonsnummer } from '../../../modell/Arbeidsgiver';

import { AmplitudeProvider } from '../AmplitudeContext';
import { getErrorMelding, LoggHeader } from '../Saksbilde';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Sykmeldingsperiode } from '../sykmeldingsperiode/Sykmeldingsperiode';
import { Toppvarsler } from '../toppvarsler/Toppvarsler';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Utbetalingshistorikk } from '../utbetalingshistorikk/Utbetalingshistorikk';
import { Vilkår } from '../vilkår/Vilkår';

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
    const organisasjonsnummer = useOrganisasjonsnummer(aktivVedtaksperiode.id);
    const arbeidsgivernavn = useArbeidsgivernavn(organisasjonsnummer) ?? 'Ukjent arbeidsgivernavn';
    const arbeidsforhold = useArbeidsforhold(organisasjonsnummer) ?? [];
    const skjæringstidspunkt = aktivVedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt;
    const maksdato = aktivVedtaksperiode.vilkår?.dagerIgjen.maksdato;
    const gjenståendeDager = aktivVedtaksperiode.vilkår?.dagerIgjen.gjenståendeDager;
    const utbetalingstidslinje = aktivVedtaksperiode.utbetalingstidslinje;
    const sykdomstidslinje = aktivVedtaksperiode.sykdomstidslinje;
    const periode = { fom: aktivVedtaksperiode.fom, tom: aktivVedtaksperiode.tom };
    const månedsbeløp = aktivVedtaksperiode.inntektsgrunnlag?.inntekter?.find(
        (it) => it.organisasjonsnummer === organisasjonsnummer
    )?.omregnetÅrsinntekt?.månedsbeløp;
    const over67år = (aktivVedtaksperiode.vilkår?.alder.alderSisteSykedag ?? 0) >= 67;

    return (
        <div data-testid="saksbilde-vedtaksperiode">
            <Switch>
                <Route path={`${path}/utbetalingshistorikk`}>
                    <Utbetalingshistorikk person={personTilBehandling} />
                </Route>
                <Route>
                    <Flex justifyContent="space-between" flex={1}>
                        <AutoFlexContainer>
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
                            <ErrorBoundary key={aktivVedtaksperiode.id} fallback={errorMelding}>
                                <AmplitudeProvider>
                                    <Flex style={{ flex: 1, height: 'calc(100% - 75px)' }}>
                                        <FlexColumn style={{ flex: 1, height: '100%' }}>
                                            <Toppvarsler vedtaksperiode={aktivVedtaksperiode} />
                                            <Content>
                                                <Switch>
                                                    <Route path={`${path}/utbetaling`}>
                                                        <Utbetaling
                                                            gjenståendeDager={gjenståendeDager}
                                                            utbetalingstidslinje={utbetalingstidslinje}
                                                            sykdomstidslinje={sykdomstidslinje}
                                                            maksdato={maksdato}
                                                            periode={periode}
                                                            skjæringstidspunkt={skjæringstidspunkt}
                                                            organisasjonsnummer={organisasjonsnummer}
                                                            arbeidsgivernavn={arbeidsgivernavn}
                                                            arbeidsforhold={arbeidsforhold}
                                                            månedsbeløp={månedsbeløp}
                                                        />
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
        </div>
    );
};
