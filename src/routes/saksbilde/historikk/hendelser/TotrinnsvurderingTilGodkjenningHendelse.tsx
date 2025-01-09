import React, { ReactElement } from 'react';

import { HistorikkPaperplaneIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
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
