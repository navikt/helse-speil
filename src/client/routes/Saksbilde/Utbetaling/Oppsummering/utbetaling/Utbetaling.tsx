import React from 'react';
import { Utbetalingsdialog } from './Utbetalingsdialog';
import { Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';

interface UtbetalingProps {
    vedtaksperiode: Vedtaksperiode;
    person: Person;
}

export const Utbetaling = ({ vedtaksperiode, person }: UtbetalingProps) => {
    const harOppgave =
        vedtaksperiode.oppgavereferanse?.length > 0 && vedtaksperiode.tilstand === Vedtaksperiodetilstand.Oppgaver;

    return harOppgave ? <Utbetalingsdialog vedtaksperiode={vedtaksperiode} person={person} /> : null;
};
