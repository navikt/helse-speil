import React from 'react';

import { Tidslinjeperiode, useUtbetaling } from '../../../../../modell/UtbetalingshistorikkElement';
import { harOppgave, useOppgavereferanse } from '../../../../../state/tidslinje';

import { Utbetalingsdialog } from './Utbetalingsdialog';

interface UtbetalingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Utbetaling = ({ aktivPeriode }: UtbetalingProps) => {
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const utbetaling = useUtbetaling(aktivPeriode.beregningId);
    const harBeløpTilUtbetaling = utbetaling?.nettobeløp ? utbetaling.nettobeløp !== 0 : false;
    const utbetalingsknappTekst = harBeløpTilUtbetaling ? 'Utbetal' : 'Godkjenn';

    return harOppgave(aktivPeriode) && oppgavereferanse ? (
        <Utbetalingsdialog
            aktivPeriode={aktivPeriode}
            oppgavereferanse={oppgavereferanse}
            godkjenningsknappTekst={utbetalingsknappTekst}
        />
    ) : null;
};
