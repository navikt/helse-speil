import styled from '@emotion/styled';
import React from 'react';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import {
    useOrganisasjonsnummer,
    useVilkårsgrunnlaghistorikk,
    useVurderingForSkjæringstidspunkt,
} from '../../../state/person';
import { useMaybeAktivPeriode } from '../../../state/tidslinje';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';

const Container = styled.section`
    width: 100%;
    height: 100%;
    padding-top: 2rem;
    box-sizing: border-box;
`;

interface SykepengegrunnlagProps {
    vilkårsgrunnlaghistorikkId: UUID;
    skjæringstidspunkt: DateString;
}

export const Sykepengegrunnlag = ({ vilkårsgrunnlaghistorikkId, skjæringstidspunkt }: SykepengegrunnlagProps) => {
    const organisasjonsnummer = useOrganisasjonsnummer();
    const vilkårsgrunnlag = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlaghistorikkId);
    const aktivPeriode = useMaybeAktivPeriode()!;
    const unique =
        aktivPeriode.tilstand === 'utenSykefravær' ? undefined : (aktivPeriode as TidslinjeperiodeMedSykefravær).unique;
    const vurdering = useVurderingForSkjæringstidspunkt(unique, aktivPeriode.skjæringstidspunkt!);

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
