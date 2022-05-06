import React from 'react';

import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: Oppgave;
}

export const TildelingView = React.memo(({ oppgave }: TildelingProps) =>
    oppgave.tildeling ? (
        <Tildelt name={oppgave.tildeling.saksbehandler.navn} />
    ) : (
        <IkkeTildelt oppgavereferanse={oppgave.oppgavereferanse} />
    ),
);
