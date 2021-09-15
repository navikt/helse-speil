import styled from '@emotion/styled';
import { Person, Vedtaksperiode } from 'internal-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import '@navikt/helse-frontend-logg/lib/main.css';

import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Flex, FlexColumn } from '../../../components/Flex';
import { useSetVedtaksperiodeReferanserForNotater } from '../../../hooks/useSetVedtaksperiodeReferanserForNotater';
import { erOver67År, getMånedsbeløp, getSkjæringstidspunkt } from '../../../mapping/selectors';
import { useArbeidsforhold, useArbeidsgivernavn } from '../../../modell/arbeidsgiver';
import { Tidslinjeperiode, useMaksdato } from '../../../modell/utbetalingshistorikkelement';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
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

const Container = styled(Flex)`
    flex: 1;
    min-width: var(--speil-total-min-width);
`;

const AutoFlexContainer = styled.div`
    flex: auto;
`;

const Content = styled.div`
    padding: 0 2rem;
    height: 100%;
    box-sizing: border-box;
    flex: 1;
`;

interface SaksbildeRevurderingProps {
    personTilBehandling: Person;
    aktivPeriode: Tidslinjeperiode;
    path: String;
}

export const SaksbildeFullstendigPeriode = ({ personTilBehandling, aktivPeriode, path }: SaksbildeRevurderingProps) => {
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const arbeidsgivernavn = useArbeidsgivernavn(aktivPeriode.organisasjonsnummer) ?? 'Ukjent';
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const errorMelding = getErrorMelding(aktivPeriode.tilstand);

    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    useSetVedtaksperiodeReferanserForNotater(vedtaksperiode.id ? [vedtaksperiode.id] : []);

    const over67år = erOver67År(vedtaksperiode);
    const månedsbeløp = getMånedsbeløp(vedtaksperiode, aktivPeriode.organisasjonsnummer);
    const skjæringstidspunkt = getSkjæringstidspunkt(vedtaksperiode);
    const saksbehandler = useInnloggetSaksbehandler();

    return (
        <Container data-testid="saksbilde-fullstendig">
            <AutoFlexContainer>
                <ErrorBoundary key={vedtaksperiode.id} fallback={errorMelding}>
                    <AmplitudeProvider>
                        <Flex flex={1} style={{ height: '100%' }}>
                            <VenstreMeny
                                aktivPeriode={aktivPeriode}
                                maksdato={maksdato}
                                arbeidsgivernavn={arbeidsgivernavn}
                                organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                                arbeidsforhold={arbeidsforhold}
                                anonymiseringEnabled={anonymiseringEnabled}
                                over67År={over67år}
                                simulering={vedtaksperiode.simuleringsdata}
                                månedsbeløp={månedsbeløp}
                                skjæringstidspunkt={skjæringstidspunkt}
                            />
                            <FlexColumn style={{ flex: 1, height: '100%' }}>
                                <Saksbildevarsler
                                    aktivPeriode={aktivPeriode}
                                    vedtaksperiode={vedtaksperiode}
                                    saksbehandler={saksbehandler}
                                    oppgavereferanse={oppgavereferanse}
                                    tildeling={personTilBehandling.tildeling}
                                />
                                <Switch>
                                    <Route path={`${path}/utbetaling`}>
                                        <Utbetaling
                                            periode={aktivPeriode}
                                            overstyringer={vedtaksperiode.overstyringer}
                                        />
                                    </Route>
                                    <Route path={`${path}/inngangsvilkår`}>
                                        <Content>
                                            <Vilkår vedtaksperiode={vedtaksperiode} person={personTilBehandling} />
                                        </Content>
                                    </Route>
                                    <Route path={`${path}/sykepengegrunnlag`}>
                                        <Content>
                                            <Sykepengegrunnlag
                                                vedtaksperiode={vedtaksperiode}
                                                person={personTilBehandling}
                                            />
                                        </Content>
                                    </Route>
                                    {vedtaksperiode.risikovurdering && (
                                        <Content>
                                            <Route path={`${path}/faresignaler`}>
                                                <Faresignaler risikovurdering={vedtaksperiode.risikovurdering} />
                                            </Route>
                                        </Content>
                                    )}
                                </Switch>
                            </FlexColumn>
                        </Flex>
                    </AmplitudeProvider>
                </ErrorBoundary>
            </AutoFlexContainer>
            <Historikk
                vedtaksperiodeId={vedtaksperiode.id}
                tildeling={personTilBehandling.tildeling}
                personinfo={personTilBehandling.personinfo}
            />
        </Container>
    );
};
