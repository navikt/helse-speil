import React from 'react';

import { Cell } from '../Cell';
import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: Oppgave;
}

export const TildelingCell = React.memo(({ oppgave }: TildelingProps) => (
    <Cell>
        {oppgave.tildeling ? (
            <Tildelt name={oppgave.tildeling.saksbehandler.navn} />
        ) : (
            <IkkeTildelt oppgavereferanse={oppgave.oppgavereferanse} />
        )}
    </Cell>
));
