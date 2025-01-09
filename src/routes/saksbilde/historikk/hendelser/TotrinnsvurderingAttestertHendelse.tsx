import React, { ReactElement } from 'react';

import { HistorikkCheckmarkCircleIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type TotrinnsvurderingAttestertHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingAttestertHendelse = ({
    saksbehandler,
    timestamp,
}: TotrinnsvurderingAttestertHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkCheckmarkCircleIkon />}
        title="Godkjent og utbetalt"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
