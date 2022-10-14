import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Cell } from '../Cell';
import { IkkeTildelt } from './IkkeTildelt';
import { Tildelt } from './Tildelt';

interface TildelingProps {
    oppgave: OppgaveForOversiktsvisning;
    kanTildeles: boolean;
}

export const TildelingCell = React.memo(({ oppgave, kanTildeles }: TildelingProps) => (
    <Cell>
        {kanTildeles &&
            (oppgave.tildeling ? (
                <Tildelt name={oppgave.tildeling.navn} />
            ) : (
                <IkkeTildelt oppgavereferanse={oppgave.id} />
            ))}
    </Cell>
));
