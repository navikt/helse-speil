import React, { ReactElement } from 'react';

import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type FjernetFraPåVentHendelseProps = {
    hendelse: HistorikkhendelseObject;
};

export const FjernetFraPåVentHendelse = ({ hendelse }: FjernetFraPåVentHendelseProps): ReactElement => (
    <Historikkhendelse
        title="Fjernet fra på vent"
        icon={<HistorikkTimerPauseIkon />}
        timestamp={hendelse.timestamp}
        saksbehandler={hendelse.saksbehandler ?? undefined}
    />
);
