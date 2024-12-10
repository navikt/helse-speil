import React, { ReactElement } from 'react';

import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { HistorikkhendelseObject } from '@typer/historikk';

type FjernFraPåVentHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const FjernFraPåVentHendelse = ({ saksbehandler, timestamp }: FjernFraPåVentHendelseProps): ReactElement => (
    <EnkelHendelse
        title="Fjernet fra på vent"
        icon={<PåVentIkon />}
        saksbehandler={saksbehandler ?? undefined}
        timestamp={timestamp}
    />
);
