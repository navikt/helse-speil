import styled from '@emotion/styled';
import React from 'react';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { useArbeidsgiver } from '../../../modell/arbeidsgiver';
import { useUtbetaling } from '../../../modell/utbetalingshistorikkelement';
import { useOrganisasjonsnummer, useVilkårsgrunnlaghistorikk } from '../../../state/person';
import { useAktivPeriode } from '../../../state/tidslinje';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';

const Container = styled.section`
    width: 100%;
    height: 100%;
    padding-top: 2rem;
    box-sizing: border-box;
`;

const sorterAscending = (a: Tidslinjeperiode, b: Tidslinjeperiode) => a.fom.diff(b.fom);

const useVurderingForSkjæringstidspunkt = (uniqueId: string, skjæringstidspunkt: string): Vurdering | undefined => {
    const perioder = useArbeidsgiver()!.tidslinjeperioder.find((it) => it.find((it) => it.unique === uniqueId)!)!;

    const førstePeriodeForSkjæringstidspunkt = [...perioder]
        .sort(sorterAscending)
        .filter((it) => it.skjæringstidspunkt === skjæringstidspunkt)
        .shift()!;

    return useUtbetaling(førstePeriodeForSkjæringstidspunkt.beregningId)?.vurdering;
};

interface SykepengegrunnlagProps {
    vilkårsgrunnlaghistorikkId: UUID;
    skjæringstidspunkt: DateString;
}

export const Sykepengegrunnlag = ({ vilkårsgrunnlaghistorikkId, skjæringstidspunkt }: SykepengegrunnlagProps) => {
    const organisasjonsnummer = useOrganisasjonsnummer();
    const vilkårsgrunnlag = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlaghistorikkId);

    const aktivPeriode = useAktivPeriode()!;
    const vurdering = useVurderingForSkjæringstidspunkt(aktivPeriode.unique, aktivPeriode.skjæringstidspunkt!);

    return (
        <Container className="Sykepengegrunnlag">
            <AgurkErrorBoundary>
                {vilkårsgrunnlag?.vilkårsgrunnlagtype === 'SPLEIS' ? (
                    vurdering ? (
                        <BehandletSykepengegrunnlag
                            vurdering={vurdering}
                            vilkårsgrunnlag={vilkårsgrunnlag as ExternalSpleisVilkårsgrunnlag}
                            organisasjonsnummer={organisasjonsnummer}
                        />
                    ) : (
                        <UbehandletSykepengegrunnlag
                            vilkårsgrunnlag={vilkårsgrunnlag as ExternalSpleisVilkårsgrunnlag}
                            organisasjonsnummer={organisasjonsnummer}
                        />
                    )
                ) : (
                    <SykepengegrunnlagFraInfogtrygd
                        vilkårsgrunnlag={vilkårsgrunnlag as ExternalInfotrygdVilkårsgrunnlag}
                        organisasjonsnummer={organisasjonsnummer}
                    />
                )}
            </AgurkErrorBoundary>
        </Container>
    );
};
