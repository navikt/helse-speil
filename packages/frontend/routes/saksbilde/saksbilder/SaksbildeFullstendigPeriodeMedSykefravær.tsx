import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useOppgavereferanse, useVedtaksperiode } from '../../../state/tidslinje';
import { useArbeidsforhold } from '../../../modell/arbeidsgiver';
import { useMaksdato } from '../../../modell/utbetalingshistorikkelement';
import { usePersondataSkalAnonymiseres } from '../../../state/person';
import { useSetVedtaksperiodeReferanserForNotater } from '../../../hooks/useSetVedtaksperiodeReferanserForNotater';
import { getAlderVedSisteSykedag, getMånedsbeløp } from '../../../mapping/selectors';
import { ISO_DATOFORMAT } from '../../../utils/date';
import { VenstreMenyMedSykefravær } from '../venstremeny/Venstremeny';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Inngangsvilkår } from '../vilkår/Inngangsvilkår';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Historikk } from '../historikk/Historikk';
import { Tooltip } from '../../../components/Tooltip';
import React from 'react';
import { Content, RouteContainer } from './SaksbildeFullstendigPeriode';

interface SaksbildeFullstendigPeriodeMedSykefraværProps {
    personTilBehandling: Person;
    aktivPeriode: TidslinjeperiodeMedSykefravær;
}

export const SaksbildeFullstendigPeriodeMedSykefravær = ({
    personTilBehandling,
    aktivPeriode,
}: SaksbildeFullstendigPeriodeMedSykefraværProps) => {
    const { path } = useRouteMatch();
    const beregningId =
        aktivPeriode.tilstand === 'utenSykefravær'
            ? undefined
            : (aktivPeriode as TidslinjeperiodeMedSykefravær).beregningId;

    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const oppgavereferanse = useOppgavereferanse(beregningId);
    const arbeidsforhold = useArbeidsforhold(aktivPeriode.organisasjonsnummer) ?? [];

    const maksdato = useMaksdato(beregningId);
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    useSetVedtaksperiodeReferanserForNotater(vedtaksperiode?.id ? [vedtaksperiode.id] : []);

    const alderVedSisteSykedag = getAlderVedSisteSykedag(
        personTilBehandling.personinfo.fødselsdato!.format(ISO_DATOFORMAT),
        aktivPeriode
    );

    const månedsbeløp = getMånedsbeløp(vedtaksperiode, aktivPeriode.organisasjonsnummer);

    if (!aktivPeriode.skjæringstidspunkt || !aktivPeriode.vilkårsgrunnlaghistorikkId) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    return (
        <>
            <VenstreMenyMedSykefravær
                aktivPeriode={aktivPeriode as TidslinjeperiodeMedSykefravær}
                maksdato={maksdato}
                organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                arbeidsforhold={arbeidsforhold}
                anonymiseringEnabled={anonymiseringEnabled}
                alderVedSisteSykedag={alderVedSisteSykedag}
                simulering={{
                    arbeidsgiver: vedtaksperiode!.utbetaling?.arbeidsgiverOppdrag.simuleringsResultat,
                    person: vedtaksperiode!.utbetaling?.personOppdrag.simuleringsResultat,
                }}
                månedsbeløp={månedsbeløp}
                skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
            />
            <Content className="Content" data-testid="saksbilde-content-med-sykefravær">
                <Saksbildevarsler
                    aktivPeriode={aktivPeriode}
                    vedtaksperiode={vedtaksperiode}
                    oppgavereferanse={oppgavereferanse}
                />
                <Switch>
                    <Route path={`${path}/utbetaling`}>
                        <Utbetaling
                            periode={aktivPeriode as TidslinjeperiodeMedSykefravær}
                            overstyringer={vedtaksperiode.overstyringer}
                            skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
                        />
                    </Route>
                    <Route path={`${path}/inngangsvilkår`}>
                        <RouteContainer>
                            <Inngangsvilkår
                                skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
                                vilkårsgrunnlagHistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                            />
                        </RouteContainer>
                    </Route>
                    <Route path={`${path}/sykepengegrunnlag`}>
                        <RouteContainer>
                            <Sykepengegrunnlag
                                skjæringstidspunkt={aktivPeriode.skjæringstidspunkt}
                                vilkårsgrunnlaghistorikkId={aktivPeriode.vilkårsgrunnlaghistorikkId}
                            />
                        </RouteContainer>
                    </Route>
                    {vedtaksperiode?.risikovurdering && (
                        <Route path={`${path}/faresignaler`}>
                            <RouteContainer>
                                <Faresignaler risikovurdering={vedtaksperiode.risikovurdering} />
                            </RouteContainer>
                        </Route>
                    )}
                </Switch>
            </Content>
            {vedtaksperiode && (
                <Historikk
                    vedtaksperiodeId={vedtaksperiode.id}
                    tildeling={personTilBehandling.tildeling}
                    personinfo={personTilBehandling.personinfo}
                />
            )}
            <Tooltip effect="solid" />
        </>
    );
};
