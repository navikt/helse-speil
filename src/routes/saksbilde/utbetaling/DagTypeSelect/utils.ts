import type { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';

export function visningstekst(dag: Speildag): string {
    return dag.speilDagtype === 'AvslattMeldingTilNav' ? 'Avslått melding til Nav' : dag.visningstekst;
}
