import styled from '@emotion/styled';
import { Person, Vedtaksperiode } from 'internal-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import '@navikt/helse-frontend-logg/lib/main.css';

import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { erOver67År, getMånedsbeløp, getSkjæringstidspunkt } from '../../../mapping/selectors';
import { useArbeidsforhold, useArbeidsgivernavn } from '../../../modell/Arbeidsgiver';
import { Tidslinjeperiode, useGjenståendeDager, useMaksdato } from '../../../modell/UtbetalingshistorikkElement';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';

import { AmplitudeProvider } from '../AmplitudeContext';
import { getErrorMelding } from '../Saksbilde';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Historikk } from '../historikk/Historikk';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { VenstreMeny } from '../venstremeny/Venstremeny';
import { Vilkår } from '../vilkår/Vilkår';

interface SaksbildeVedtaksperiodeProps {
    personTilBehandling: Person;
    aktivPeriode: Tidslinjeperiode;
    path: String;
}

const Container = styled(Flex)`
    flex: 1;
    min-width: var(--speil-total-min-width);
    overflow: auto;
    overflow-x: hidden;
`;

const AutoFlexContainer = styled.div`
    flex: auto;
`;

const Content = styled.div`
    padding: 0 2.5rem;
    height: 100%;
    box-sizing: border-box;
    max-width: calc(100vw - var(--speil-venstremeny-width) - var(--speil-historikk-width));
`;

export const SaksbildeVedtaksperiode = ({ personTilBehandling, aktivPeriode, path }: SaksbildeVedtaksperiodeProps) => {
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent arbeidsgivernavn';
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const errorMelding = getErrorMelding(vedtaksperiode.tilstand);

    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const gjenståendeDager = useGjenståendeDager(aktivPeriode.beregningId);

    const anonymiseringEnabled = usePersondataSkalAnonymiseres();

    const over67år = erOver67År(vedtaksperiode);
    const månedsbeløp = getMånedsbeløp(vedtaksperiode, aktivPeriode.organisasjonsnummer);
    const skjæringstidspunkt = getSkjæringstidspunkt(vedtaksperiode);

    return (
        <Container data-testid="saksbilde-vedtaksperiode">
            <AutoFlexContainer>
                <ErrorBoundary key={vedtaksperiode.id} fallback={errorMelding}>
                    <AmplitudeProvider>
                        <Flex flex={1} style={{ height: '100%' }}>
                            <VenstreMeny
                                aktivPeriode={aktivPeriode}
                                arbeidsgivernavn={arbeidsgivernavn}
                                organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                                arbeidsforhold={arbeidsforhold}
                                anonymiseringEnabled={anonymiseringEnabled}
                                skjæringstidspunkt={skjæringstidspunkt}
                                maksdato={maksdato}
                                over67År={over67år}
                                månedsbeløp={månedsbeløp}
                                simulering={vedtaksperiode.simuleringsdata}
                            />
                            <FlexColumn style={{ flex: 1, height: '100%' }}>
                                <Saksbildevarsler
                                    aktivPeriode={aktivPeriode}
                                    vedtaksperiode={vedtaksperiode}
                                    oppgavereferanse={oppgavereferanse}
                                />
                                <Content>
                                    <Switch>
                                        <Route path={`${path}/utbetaling`}>
                                            <Utbetaling
                                                periode={aktivPeriode}
                                                maksdato={maksdato}
                                                vedtaksperiode={vedtaksperiode}
                                                gjenståendeDager={gjenståendeDager}
                                            />
                                        </Route>
                                        <Route path={`${path}/vilkår`}>
                                            <Vilkår vedtaksperiode={vedtaksperiode} person={personTilBehandling} />
                                        </Route>
                                        <Route path={`${path}/sykepengegrunnlag`}>
                                            <Sykepengegrunnlag
                                                vedtaksperiode={vedtaksperiode}
                                                person={personTilBehandling}
                                            />
                                        </Route>
                                        {vedtaksperiode.risikovurdering && (
                                            <Route path={`${path}/faresignaler`}>
                                                <Faresignaler risikovurdering={vedtaksperiode.risikovurdering} />
                                            </Route>
                                        )}
                                    </Switch>
                                </Content>
                            </FlexColumn>
                        </Flex>
                    </AmplitudeProvider>
                </ErrorBoundary>
            </AutoFlexContainer>
            <Historikk />
        </Container>
    );
};
