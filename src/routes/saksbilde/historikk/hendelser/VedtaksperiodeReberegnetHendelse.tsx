import React, { ReactElement } from 'react';

import { VedtaksperiodeReberegnetIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type VedtaksperiodeReberegnetHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const VedtaksperiodeReberegnetHendelse = ({
    saksbehandler,
    timestamp,
}: VedtaksperiodeReberegnetHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<VedtaksperiodeReberegnetIkon />}
        title="Periode reberegnet"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
