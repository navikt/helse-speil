import React from 'react';

import { Cell } from '../Cell';
import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: Oppgave;
    kanTildeles: boolean;
}

export const TildelingCell = React.memo(({ oppgave, kanTildeles }: TildelingProps) => (
    <Cell>
        {kanTildeles &&
            (oppgave.tildeling ? (
                <Tildelt name={oppgave.tildeling.saksbehandler.navn} />
            ) : (
                <IkkeTildelt oppgavereferanse={oppgave.oppgavereferanse} />
            ))}
    </Cell>
));
