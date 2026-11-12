import type { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';

export function visningstekst(dag: Speildag): string {
    return dag.speilDagtype === 'AvslattMeldingTilNav' ? 'Avslått melding til Nav' : dag.visningstekst;
}

// Verdien til valget i dagtypevelgeren. Den er ingen dagtype og havner aldri i dagtype-feltet i skjemaet.
export const oppholdUtenforEøsVerdi = 'OppholdUtenforEøs';
