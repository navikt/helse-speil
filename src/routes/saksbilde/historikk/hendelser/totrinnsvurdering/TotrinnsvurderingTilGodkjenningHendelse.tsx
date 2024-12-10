import React, { ReactElement } from 'react';

import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { TotrinnsvurderingTilGodkjenningIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { HistorikkhendelseObject } from '@typer/historikk';

type TotrinnsvurderingTilGodkjenningHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingTilGodkjenningHendelse = ({
    saksbehandler,
    timestamp,
}: TotrinnsvurderingTilGodkjenningHendelseProps): ReactElement => (
    <EnkelHendelse
        title="Sendt til godkjenning"
        icon={<TotrinnsvurderingTilGodkjenningIkon />}
        saksbehandler={saksbehandler ?? undefined}
        timestamp={timestamp}
    />
);
