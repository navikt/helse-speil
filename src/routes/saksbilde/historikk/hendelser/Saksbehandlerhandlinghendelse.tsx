import React, { ReactElement } from 'react';

import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { tilSaksbehandlerhandlingTekst } from '@state/saksbehandlerhandlinger';
import { SaksbehandlerhandlinghendelseObject } from '@typer/historikk';

type SaksbehandlerhandlinghendelseProps = {
    hendelse: SaksbehandlerhandlinghendelseObject;
};

export function Saksbehandlerhandlinghendelse({
    hendelse: { handlingType, saksbehandler, timestamp },
}: SaksbehandlerhandlinghendelseProps): ReactElement {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title={tilSaksbehandlerhandlingTekst(handlingType)}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        />
    );
}
