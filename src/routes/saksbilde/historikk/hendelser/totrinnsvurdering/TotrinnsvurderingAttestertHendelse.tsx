import React, { ReactElement } from 'react';

import { TotrinnsvurderingAttestertIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type TotrinnsvurderingAttestertHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingAttestertHendelse = ({
    saksbehandler,
    timestamp,
}: TotrinnsvurderingAttestertHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<TotrinnsvurderingAttestertIkon />}
        title="Godkjent og utbetalt"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
