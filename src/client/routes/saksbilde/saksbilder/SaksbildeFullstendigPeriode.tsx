import styled from '@emotion/styled';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Tooltip } from '../../../components/Tooltip';
import { useSetVedtaksperiodeReferanserForNotater } from '../../../hooks/useSetVedtaksperiodeReferanserForNotater';
import { erOver67År, getMånedsbeløp, getSkjæringstidspunkt } from '../../../mapping/selectors';
import { useArbeidsforhold } from '../../../modell/arbeidsgiver';
import { useMaksdato } from '../../../modell/utbetalingshistorikkelement';
import { useInnloggetSaksbehandler } from '../../../state/authentication';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';
import { ISO_DATOFORMAT } from '../../../utils/date';

import { AmplitudeProvider } from '../AmplitudeContext';
import { getErrorMessage } from '../errorMessages';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Historikk } from '../historikk/Historikk';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { VenstreMeny } from '../venstremeny/Venstremeny';
import { Inngangsvilkår } from '../vilkår/Inngangsvilkår';

const guard = <T,>(message: string, value: T): NonNullable<T> => {
    if (value === undefined && value === null) {
        throw Error(message);
    }
    return value as NonNullable<T>;
};

const RouteContainer = styled.div`
    padding: 0 2rem;
    overflow-x: scroll;
    box-sizing: border-box;
`;

const Content = styled.div`
    grid-area: content;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

interface SaksbildeRevurderingProps {
    personTilBehandling: Person;
    aktivPeriode: Tidslinjeperiode;
}

export const SaksbildeFullstendigPeriode = ({ personTilBehandling, aktivPeriode }: SaksbildeRevurderingProps) => {
    const { path } = useRouteMatch();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];
    const errorMelding = getErrorMessage(aktivPeriode.tilstand);

    const maksdato = useMaksdato(aktivPeriode.beregningId);
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    useSetVedtaksperiodeReferanserForNotater(vedtaksperiode.id ? [vedtaksperiode.id] : []);

    const over67år = erOver67År(vedtaksperiode);
    const månedsbeløp = getMånedsbeløp(vedtaksperiode, aktivPeriode.organisasjonsnummer);
    const skjæringstidspunkt = getSkjæringstidspunkt(vedtaksperiode);
    const saksbehandler = useInnloggetSaksbehandler();

    if (!skjæringstidspunkt || !aktivPeriode.vilkårsgrunnlaghistorikkId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <ErrorBoundary key={vedtaksperiode.id} fallback={errorMelding}>
            <AmplitudeProvider>
                <VenstreMeny
                    aktivPeriode={aktivPeriode}
                    maksdato={maksdato}
                    organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                    arbeidsforhold={arbeidsforhold}
                    anonymiseringEnabled={anonymiseringEnabled}
                    over67År={over67år}
                    simulering={vedtaksperiode.simuleringsdata}
                    månedsbeløp={månedsbeløp}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
                <Content className="Content" data-testid="saksbilde-content">
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
                                skjæringstidspunkt={vedtaksperiode.vilkår?.dagerIgjen.skjæringstidspunkt}
                            />
                        </Route>
                        <Route path={`${path}/inngangsvilkår`}>
                            <RouteContainer>
                                <Inngangsvilkår
                                    skjæringstidspunkt={skjæringstidspunkt.format(ISO_DATOFORMAT)}
                                    vilkårsgrunnlagHistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                                />
                            </RouteContainer>
                        </Route>
                        <Route path={`${path}/sykepengegrunnlag`}>
                            <RouteContainer>
                                <Sykepengegrunnlag
                                    skjæringstidspunkt={skjæringstidspunkt.format(ISO_DATOFORMAT)}
                                    vilkårsgrunnlaghistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                                />
                            </RouteContainer>
                        </Route>
                        {vedtaksperiode.risikovurdering && (
                            <Route path={`${path}/faresignaler`}>
                                <RouteContainer>
                                    <Faresignaler risikovurdering={vedtaksperiode.risikovurdering} />
                                </RouteContainer>
                            </Route>
                        )}
                    </Switch>
                </Content>
                <Historikk
                    vedtaksperiodeId={vedtaksperiode.id}
                    tildeling={personTilBehandling.tildeling}
                    personinfo={personTilBehandling.personinfo}
                />
                <Tooltip effect="solid" />
            </AmplitudeProvider>
        </ErrorBoundary>
    );
};
