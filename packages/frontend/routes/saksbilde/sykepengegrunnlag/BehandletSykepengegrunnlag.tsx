import React from 'react';

import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

import { getFormattedDateString } from '@utils/date';
import { AutomatiskVurdering } from '@components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '@components/Saksbehandlervurdering';
import { Arbeidsgiver, Inntektsgrunnlag, Maybe, Refusjon, VilkarsgrunnlagSpleis, Vurdering } from '@io/graphql';

interface BehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    skjæringstidspunkt: DateString;
    inntektsgrunnlag: Inntektsgrunnlag;
    arbeidsgiver: Omit<Arbeidsgiver, 'generasjoner' | 'ghostPerioder' | 'overstyringer'>;
    refusjon?: Maybe<Refusjon>;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    vilkårsgrunnlag,
    skjæringstidspunkt,
    inntektsgrunnlag,
    arbeidsgiver,
    refusjon,
}: BehandletSykepengegrunnlagProps) => {
    const title = `Sykepengegrunnlag satt ved skjæringstidspunkt - ${getFormattedDateString(skjæringstidspunkt)}`;
    const Wrapper = vurdering.automatisk ? AutomatiskVurdering : Saksbehandlervurdering;

    return (
        <Wrapper title={title} ident={vurdering.ident}>
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                data-testid="behandlet-sykepengegrunnlag"
                inntektsgrunnlag={inntektsgrunnlag}
                skjæringstidspunkt={skjæringstidspunkt}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                refusjon={refusjon}
            />
        </Wrapper>
    );
};
