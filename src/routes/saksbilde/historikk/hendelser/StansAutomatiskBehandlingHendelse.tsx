import React, { ReactElement } from 'react';

import { StansAutomatiskBehandlingIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type StansAutomatiskBehandlingHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const StansAutomatiskBehandlingHendelse = ({
    saksbehandler,
    timestamp,
}: StansAutomatiskBehandlingHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<StansAutomatiskBehandlingIkon />}
        title="Automatisk behandling stanset"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
