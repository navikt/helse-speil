import React from 'react';

import { useUtbetaling } from '../../../../modell/utbetalingshistorikkelement';
import { harOppgave, useOppgavereferanse } from '../../../../state/tidslinje';

import { Utbetalingsdialog } from './Utbetalingsdialog';

interface UtbetalingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Utbetaling = ({ aktivPeriode }: UtbetalingProps) => {
    const erRevurdering = aktivPeriode.type === 'REVURDERING';
    const utbetaling = useUtbetaling(aktivPeriode.beregningId);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);

    if (!(harOppgave(aktivPeriode) && oppgavereferanse)) return null;

    const harBeløpTilUtbetaling = utbetaling?.arbeidsgiverNettobeløp ? utbetaling.arbeidsgiverNettobeløp !== 0 : false;
    const utbetalingsknappTekst = erRevurdering ? 'Revurder' : harBeløpTilUtbetaling ? 'Utbetal' : 'Godkjenn';

    return (
        <Utbetalingsdialog
            aktivPeriode={aktivPeriode}
            oppgavereferanse={oppgavereferanse}
            godkjenningsknappTekst={utbetalingsknappTekst}
            kanAvvises={!erRevurdering}
        />
    );
};
