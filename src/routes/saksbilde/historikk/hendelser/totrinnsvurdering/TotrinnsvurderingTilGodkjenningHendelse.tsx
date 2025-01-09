import React, { ReactElement } from 'react';

import { HistorikkPaperplaneIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type TotrinnsvurderingTilGodkjenningHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingTilGodkjenningHendelse = ({
    saksbehandler,
    timestamp,
}: TotrinnsvurderingTilGodkjenningHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkPaperplaneIkon />}
        title="Sendt til godkjenning"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
