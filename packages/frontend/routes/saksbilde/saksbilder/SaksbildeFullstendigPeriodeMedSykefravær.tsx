import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { useMaksdato } from '../../../modell/utbetalingshistorikkelement';
import { getAlderVedSisteSykedag, getMånedsbeløp } from '../../../mapping/selectors';

import { useOppgavereferanse, useVedtaksperiode } from '@state/tidslinje';
import { useSetVedtaksperiodeReferanserForNotater } from '@hooks/useSetVedtaksperiodeReferanserForNotater';
import { ISO_DATOFORMAT } from '@utils/date';
import { Tooltip } from '@components/Tooltip';

import { VenstreMenyMedSykefravær } from '../venstremeny/VenstremenyMedSykefravær';
import { Saksbildevarsler } from '../varsler/Saksbildevarsler';
import { Utbetaling } from '../utbetaling/Utbetaling';
import { Inngangsvilkår } from '../vilkår/Inngangsvilkår';
import { Sykepengegrunnlag } from '../sykepengegrunnlag/Sykepengegrunnlag';
import { Faresignaler } from '../faresignaler/Faresignaler';
import { Historikk } from '../historikk/Historikk';
import { Content, RouteContainer } from './SaksbildeFullstendigPeriode';
import { useCurrentPerson } from '@state/personState';
import { selectRefusjon } from '@state/selectors/person';

interface SaksbildeFullstendigPeriodeMedSykefraværProps {
    personTilBehandling: Person;
    aktivPeriode: TidslinjeperiodeMedSykefravær;
}

export const SaksbildeFullstendigPeriodeMedSykefravær = ({
    personTilBehandling,
    aktivPeriode,
}: SaksbildeFullstendigPeriodeMedSykefraværProps) => {
    const { path } = useRouteMatch();
    const beregningId = aktivPeriode.beregningId;

    const personGraphQL = useCurrentPerson();
    const refusjon = personGraphQL ? selectRefusjon(personGraphQL, beregningId) : null;

    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id) as Vedtaksperiode;
    const oppgavereferanse = useOppgavereferanse(beregningId);
    const maksdato = useMaksdato(beregningId);
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
                {aktivPeriode.type !== 'ANNULLERT_PERIODE' && (
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
                                    refusjon={refusjon}
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
                )}
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
