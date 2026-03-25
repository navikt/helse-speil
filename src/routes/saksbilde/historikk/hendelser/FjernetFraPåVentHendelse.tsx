import React, { ReactElement } from 'react';

import { HistorikkHourglassTopFilledIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HistorikkhendelseObject } from '@typer/historikk';

type FjernetFraPåVentHendelseProps = {
    hendelse: HistorikkhendelseObject;
};

export const FjernetFraPåVentHendelse = ({ hendelse }: FjernetFraPåVentHendelseProps): ReactElement => (
    <Historikkhendelse
        title="Fjernet fra på vent"
        icon={<HistorikkHourglassTopFilledIkon />}
        timestamp={hendelse.timestamp}
        saksbehandler={hendelse.saksbehandler ?? undefined}
    />
);
