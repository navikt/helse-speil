import React, { ReactElement } from 'react';

import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { DateString } from '@typer/shared';

type FjernetFraPåVentHendelseProps = {
    timestamp: DateString;
    saksbehandler?: string;
};

export const FjernetFraPåVentHendelse = ({ timestamp, saksbehandler }: FjernetFraPåVentHendelseProps): ReactElement => (
    <Historikkhendelse
        title="Fjernet fra på vent"
        icon={<PåVentIkon />}
        timestamp={timestamp}
        saksbehandler={saksbehandler}
    />
);
