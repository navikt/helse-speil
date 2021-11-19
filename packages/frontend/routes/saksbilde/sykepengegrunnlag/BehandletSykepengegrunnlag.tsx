import dayjs from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../utils/date';
import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';
import { AutomatiskVurdering } from '../../../components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '../../../components/Saksbehandlervurdering';

interface BehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
    vilkårsgrunnlag: ExternalSpleisVilkårsgrunnlag;
    organisasjonsnummer: string;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    vilkårsgrunnlag,
    organisasjonsnummer,
}: BehandletSykepengegrunnlagProps) => {
    const skjæringstidspunkt = dayjs(vilkårsgrunnlag.skjæringstidspunkt);
    const renderedSkjæringstidspunkt = skjæringstidspunkt.format(NORSK_DATOFORMAT);

    const title = `Sykepengegrunnlag satt ved skjæringstidspunkt - ${renderedSkjæringstidspunkt}`;

    return vurdering.automatisk ? (
        <AutomatiskVurdering title={title} ident={vurdering.ident}>
            <UbehandletSykepengegrunnlag
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                data-testid="behandlet-sykepengegrunnlag"
            />
        </AutomatiskVurdering>
    ) : (
        <Saksbehandlervurdering title={title} ident={vurdering.ident}>
            <UbehandletSykepengegrunnlag
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                data-testid="behandlet-sykepengegrunnlag"
            />
        </Saksbehandlervurdering>
    );
};
