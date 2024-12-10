import React, { ReactElement } from 'react';

import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { TotrinnsvurderingAttestertIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { HistorikkhendelseObject } from '@typer/historikk';

type TotrinnsvurderingAttestertHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingAttestertHendelse = ({
    saksbehandler,
    timestamp,
}: TotrinnsvurderingAttestertHendelseProps): ReactElement => (
    <EnkelHendelse
        title="Godkjent og utbetalt"
        icon={<TotrinnsvurderingAttestertIkon />}
        saksbehandler={saksbehandler ?? undefined}
        timestamp={timestamp}
    />
);
