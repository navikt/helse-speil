import React from 'react';

import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

import { getFormattedDateString } from '@utils/date';
import { AutomatiskVurdering } from '@components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '@components/Saksbehandlervurdering';
import { Inntektsgrunnlag, Refusjon, VilkarsgrunnlagSpleis, Vurdering } from '@io/graphql';

interface BehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    organisasjonsnummer: string;
    refusjon?: Refusjon | null;
    skjæringstidspunkt: DateString;
    inntektsgrunnlag: Inntektsgrunnlag;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    vilkårsgrunnlag,
    organisasjonsnummer,
    refusjon,
    skjæringstidspunkt,
    inntektsgrunnlag,
}: BehandletSykepengegrunnlagProps) => {
    const title = `Sykepengegrunnlag satt ved skjæringstidspunkt - ${getFormattedDateString(skjæringstidspunkt)}`;
    const Wrapper = vurdering.automatisk ? AutomatiskVurdering : Saksbehandlervurdering;

    return (
        <Wrapper title={title} ident={vurdering.ident}>
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                data-testid="behandlet-sykepengegrunnlag"
                inntektsgrunnlag={inntektsgrunnlag}
                refusjon={refusjon}
            />
        </Wrapper>
    );
};
