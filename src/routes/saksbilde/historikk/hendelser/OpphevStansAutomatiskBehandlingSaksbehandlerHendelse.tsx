import React, { ReactElement } from 'react';

import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type OpphevStansAutomatiskBehandlingSaksbehandlerHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export function OpphevStansAutomatiskBehandlingSaksbehandlerHendelse({
    timestamp,
    saksbehandler,
}: OpphevStansAutomatiskBehandlingSaksbehandlerHendelseProps): ReactElement {
    return (
        <Historikkhendelse
            icon={<HistorikkTimerPauseIkon />}
            title="Stans av automatisk behandling opphevet"
            timestamp={timestamp}
            saksbehandler={saksbehandler ?? undefined}
        />
    );
}
