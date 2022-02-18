import dayjs from 'dayjs';
import React from 'react';

import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';

import { NORSK_DATOFORMAT } from '@utils/date';
import { AutomatiskVurdering } from '@components/AutomatiskVurdering';
import { Saksbehandlervurdering } from '@components/Saksbehandlervurdering';
import { Refusjon } from '@io/graphql';

interface BehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
    vilkårsgrunnlag: ExternalSpleisVilkårsgrunnlag;
    organisasjonsnummer: string;
    refusjon?: Refusjon | null;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    vilkårsgrunnlag,
    organisasjonsnummer,
    refusjon,
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
                refusjon={refusjon}
            />
        </AutomatiskVurdering>
    ) : (
        <Saksbehandlervurdering title={title} ident={vurdering.ident}>
            <UbehandletSykepengegrunnlag
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                data-testid="behandlet-sykepengegrunnlag"
                refusjon={refusjon}
            />
        </Saksbehandlervurdering>
    );
};
