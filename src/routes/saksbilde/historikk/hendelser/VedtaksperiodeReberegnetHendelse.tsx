import React, { ReactElement } from 'react';

import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { VedtaksperiodeReberegnetIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { HistorikkhendelseObject } from '@typer/historikk';

type VedtaksperiodeReberegnetHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const VedtaksperiodeReberegnetHendelse = ({
    saksbehandler,
    timestamp,
}: VedtaksperiodeReberegnetHendelseProps): ReactElement => (
    <EnkelHendelse
        title="Periode reberegnet"
        icon={<VedtaksperiodeReberegnetIkon />}
        saksbehandler={saksbehandler ?? undefined}
        timestamp={timestamp}
    />
);
