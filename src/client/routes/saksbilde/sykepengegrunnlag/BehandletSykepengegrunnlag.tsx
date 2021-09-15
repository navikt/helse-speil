import { Vedtaksperiode } from 'internal-types';
import React from 'react';

import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

import { NORSK_DATOFORMAT } from '../../../utils/date';

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
    <BehandletVarsel
        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
        saksbehandler={førstePeriode?.godkjentAv!}
        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
        automatiskBehandlet={førstePeriode.automatiskBehandlet}
    >
        <UbehandletSykepengegrunnlag {...ubehandletSykepengegrunnlagProps} />
    </BehandletVarsel>
);
