import React from 'react';

import { NORSK_DATOFORMAT } from '../../../utils/date';

import { StyledBehandletVarsel } from '../vilkår/Vilkår.styles';
import { UbehandletSykepengegrunnlag, UbehandletSykepengegrunnlagProps } from './UbehandletSykepengegrunnlag';

interface BehandletSykepengegrunnlagProps extends UbehandletSykepengegrunnlagProps {
    førstePeriode: Vedtaksperiode;
    skjæringstidspunkt: string;
}

export const BehandletSykepengegrunnlag = ({
    førstePeriode,
    skjæringstidspunkt,
    ...ubehandletSykepengegrunnlagProps
}: BehandletSykepengegrunnlagProps) => (
    <StyledBehandletVarsel
        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
        saksbehandler={førstePeriode?.godkjentAv!}
        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
        automatiskBehandlet={førstePeriode.automatiskBehandlet}
    >
        <UbehandletSykepengegrunnlag {...ubehandletSykepengegrunnlagProps} />
    </StyledBehandletVarsel>
);
