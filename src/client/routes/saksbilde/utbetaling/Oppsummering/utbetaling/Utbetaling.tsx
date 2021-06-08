import React from 'react';

import { Periodetype, Tidslinjeperiode, useUtbetaling } from '../../../../../modell/UtbetalingshistorikkElement';
import { harOppgave, useOppgavereferanse } from '../../../../../state/tidslinje';

import { Utbetalingsdialog } from './Utbetalingsdialog';

interface UtbetalingProps {
    aktivPeriode: Tidslinjeperiode;
}

function UtbetalingsknappTekst(erRevurdering: boolean, harBeløpTilUtbetaling: boolean) {
    if (erRevurdering) return 'Revurder';
    return harBeløpTilUtbetaling ? 'Utbetal' : 'Godkjenn';
}

export const Utbetaling = ({ aktivPeriode }: UtbetalingProps) => {
    const erRevurdering = aktivPeriode.type === Periodetype.REVURDERING;
    const oppgavereferanse = useOppgavereferanse(aktivPeriode.beregningId);
    const utbetaling = useUtbetaling(aktivPeriode.beregningId);
    const harBeløpTilUtbetaling = utbetaling?.nettobeløp ? utbetaling.nettobeløp !== 0 : false;
    const utbetalingsknappTekst = UtbetalingsknappTekst(erRevurdering, harBeløpTilUtbetaling);

    return harOppgave(aktivPeriode) && oppgavereferanse ? (
        <Utbetalingsdialog
            aktivPeriode={aktivPeriode}
            oppgavereferanse={oppgavereferanse}
            godkjenningsknappTekst={utbetalingsknappTekst}
            kanAvvises={!erRevurdering}
        />
    ) : null;
};
