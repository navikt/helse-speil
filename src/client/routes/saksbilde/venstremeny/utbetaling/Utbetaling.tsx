import React from 'react';

import { Periodetype, Tidslinjeperiode, useUtbetaling } from '../../../../modell/UtbetalingshistorikkElement';
import { harOppgave, useOppgavereferanse } from '../../../../state/tidslinje';

import { Utbetalingsdialog } from './Utbetalingsdialog';

interface UtbetalingProps {
    aktivPeriode: Tidslinjeperiode;
}

export const Utbetaling = ({ aktivPeriode }: UtbetalingProps) => {
    const erRevurdering = aktivPeriode.type === Periodetype.REVURDERING;
    const utbetaling = useUtbetaling(aktivPeriode.beregningId);
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);

    if (!(harOppgave(aktivPeriode) && oppgavereferanse)) return null;

    const harBeløpTilUtbetaling = utbetaling?.nettobeløp ? utbetaling.nettobeløp !== 0 : false;
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
