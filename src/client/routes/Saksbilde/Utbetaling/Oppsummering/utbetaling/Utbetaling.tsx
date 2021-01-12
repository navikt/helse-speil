import React from 'react';
import { Utbetalingsdialog } from './Utbetalingsdialog';
import { Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';

interface UtbetalingProps {
    vedtaksperiode: Vedtaksperiode;
}

export const Utbetaling = ({ vedtaksperiode }: UtbetalingProps) => {
    const harOppgave =
        vedtaksperiode.oppgavereferanse?.length > 0 && vedtaksperiode.tilstand === Vedtaksperiodetilstand.Oppgaver;

    return harOppgave ? <Utbetalingsdialog vedtaksperiode={vedtaksperiode} /> : null;
};
