import dayjs from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../utils/date';

import { StyledBehandletVarsel } from '../vilkår/Vilkår.styles';
import { UbehandletSykepengegrunnlag, UbehandletSykepengegrunnlagProps } from './UbehandletSykepengegrunnlag';

interface BehandletSykepengegrunnlagProps extends UbehandletSykepengegrunnlagProps {
    vurdering: Vurdering;
}

export const BehandletSykepengegrunnlag = ({
    vurdering,
    ...ubehandletSykepengegrunnlagProps
}: BehandletSykepengegrunnlagProps) => {
    const skjæringstidspunkt = dayjs(ubehandletSykepengegrunnlagProps.vilkårsgrunnlag.skjæringstidspunkt);
    const renderedSkjæringstidspunkt = skjæringstidspunkt.format(NORSK_DATOFORMAT);
    return (
        <StyledBehandletVarsel
            tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${renderedSkjæringstidspunkt}`}
            saksbehandler={vurdering.ident}
            vurderingsdato={vurdering.tidsstempel.format(NORSK_DATOFORMAT)}
            automatiskBehandlet={vurdering.automatisk}
        >
            <UbehandletSykepengegrunnlag {...ubehandletSykepengegrunnlagProps} />
        </StyledBehandletVarsel>
    );
};
