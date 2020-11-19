import React, { useContext } from 'react';
import { Utbetalingsdialog } from './Utbetalingsdialog';
import { Vedtaksperiodetilstand } from 'internal-types';
import { FetchedPersonContext, PersonContext } from '../../../../../context/PersonContext';

export const Utbetaling = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext) as FetchedPersonContext;
    const harOppgavereferanse = aktivVedtaksperiode.oppgavereferanse && aktivVedtaksperiode.oppgavereferanse !== '';

    return harOppgavereferanse && aktivVedtaksperiode.tilstand === Vedtaksperiodetilstand.Oppgaver ? (
        <Utbetalingsdialog />
    ) : null;
};
