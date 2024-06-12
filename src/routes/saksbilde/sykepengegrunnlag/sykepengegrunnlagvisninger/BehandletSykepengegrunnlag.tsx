import React from 'react';

import { DateString } from '@/types/shared';
import { AutomatiskVurdering } from '@components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '@components/Saksbehandlervurdering';
import { ArbeidsgiverFragment, PersonFragment, VilkarsgrunnlagSpleis, Vurdering } from '@io/graphql';
import { getFormattedDateString } from '@utils/date';

import { SykepengegrunnlagFraSpleis } from './spleis/SykepengegrunnlagFraSpleis';

interface BehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    skjæringstidspunkt: DateString;
    arbeidsgiver: Omit<ArbeidsgiverFragment, 'generasjoner' | 'ghostPerioder' | 'overstyringer'>;
    person: PersonFragment;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    vilkårsgrunnlag,
    skjæringstidspunkt,
    arbeidsgiver,
    person,
}: BehandletSykepengegrunnlagProps) => {
    const title = `Sykepengegrunnlag satt ved skjæringstidspunkt - ${getFormattedDateString(skjæringstidspunkt)}`;
    const Wrapper = vurdering.automatisk ? AutomatiskVurdering : Saksbehandlervurdering;

    return (
        <Wrapper title={title} ident={vurdering.ident}>
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                data-testid="behandlet-sykepengegrunnlag"
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                person={person}
            />
        </Wrapper>
    );
};
