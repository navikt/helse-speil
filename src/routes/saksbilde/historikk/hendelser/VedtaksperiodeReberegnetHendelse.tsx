import React, { ReactElement } from 'react';

import { HistorikkArrowSquarepathIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type VedtaksperiodeReberegnetHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const VedtaksperiodeReberegnetHendelse = ({
    saksbehandler,
    timestamp,
}: VedtaksperiodeReberegnetHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkArrowSquarepathIkon />}
        title="Periode reberegnet"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
