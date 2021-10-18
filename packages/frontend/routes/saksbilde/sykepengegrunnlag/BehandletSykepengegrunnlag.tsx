import dayjs from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../utils/date';

import { StyledBehandletVarsel } from '../vilkår/Vilkår.styles';
import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';

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
    return (
        <StyledBehandletVarsel
            tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${renderedSkjæringstidspunkt}`}
            saksbehandler={vurdering.ident}
            vurderingsdato={vurdering.tidsstempel.format(NORSK_DATOFORMAT)}
            automatiskBehandlet={vurdering.automatisk}
        >
            <UbehandletSykepengegrunnlag
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={organisasjonsnummer}
                data-testid="behandlet-sykepengegrunnlag"
            />
        </StyledBehandletVarsel>
    );
};
