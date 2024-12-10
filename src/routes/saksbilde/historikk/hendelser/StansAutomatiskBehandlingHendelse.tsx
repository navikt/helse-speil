import React, { ReactElement } from 'react';

import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { StansAutomatiskBehandlingIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { HistorikkhendelseObject } from '@typer/historikk';

type StansAutomatiskBehandlingHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const StansAutomatiskBehandlingHendelse = ({
    saksbehandler,
    timestamp,
}: StansAutomatiskBehandlingHendelseProps): ReactElement => (
    <EnkelHendelse
        title="Automatisk behandling stanset"
        icon={<StansAutomatiskBehandlingIkon />}
        saksbehandler={saksbehandler ?? undefined}
        timestamp={timestamp}
    />
);
