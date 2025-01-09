import React, { ReactElement } from 'react';

import { HistorikkXMarkOctagonIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type StansAutomatiskBehandlingHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const StansAutomatiskBehandlingHendelse = ({
    saksbehandler,
    timestamp,
}: StansAutomatiskBehandlingHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkXMarkOctagonIkon />}
        title="Automatisk behandling stanset"
        timestamp={timestamp}
        saksbehandler={saksbehandler ?? undefined}
    />
);
