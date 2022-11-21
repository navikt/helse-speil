import React from 'react';

import { AutomatiskVurdering } from '@components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '@components/Saksbehandlervurdering';
import { Arbeidsgiver, Arbeidsgiverrefusjon, Maybe, VilkarsgrunnlagSpleis, Vurdering } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

interface BehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    skjæringstidspunkt: DateString;
    arbeidsgiver: Omit<Arbeidsgiver, 'generasjoner' | 'ghostPerioder' | 'overstyringer'>;
    refusjon?: Maybe<Arbeidsgiverrefusjon>;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    vilkårsgrunnlag,
    skjæringstidspunkt,
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
                skjæringstidspunkt={skjæringstidspunkt}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                refusjon={refusjon}
            />
        </Wrapper>
    );
};
