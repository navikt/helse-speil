import React from 'react';
import { Utbetalingsdialog } from './Utbetalingsdialog';
import { Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';

interface UtbetalingProps {
    vedtaksperiode: Vedtaksperiode;
}

export const Utbetaling = ({ vedtaksperiode }: UtbetalingProps) => {
    const harOppgave = vedtaksperiode.oppgavereferanse && vedtaksperiode.tilstand === Vedtaksperiodetilstand.Oppgaver;
    const harBeløpTilUtbetaling = vedtaksperiode.oppsummering.totaltTilUtbetaling > 0;

    return harOppgave ? (
        <Utbetalingsdialog
            oppgavereferanse={vedtaksperiode.oppgavereferanse!}
            harBeløpTilUtbetaling={harBeløpTilUtbetaling}
        />
    ) : null;
};
