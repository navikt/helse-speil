import React, { useContext } from 'react';
import { Utbetalingsdialog } from './Utbetalingsdialog';
import { Vedtaksperiodetilstand } from 'internal-types';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { FetchedPersonContext, PersonContext } from '../../../../../context/PersonContext';

const KanIkkeUtbetales = () => (
    <AlertStripeAdvarsel>
        <p>Denne perioden kan ikke utbetales.</p>
        <p>Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.</p>
    </AlertStripeAdvarsel>
);

export const Utbetaling = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext) as FetchedPersonContext;
    const harOppgavereferanse = aktivVedtaksperiode.oppgavereferanse && aktivVedtaksperiode.oppgavereferanse !== '';

    switch (aktivVedtaksperiode.tilstand) {
        case Vedtaksperiodetilstand.TilUtbetaling:
        case Vedtaksperiodetilstand.Utbetalt:
            return <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>;
        case Vedtaksperiodetilstand.KunFerie:
        case Vedtaksperiodetilstand.IngenUtbetaling:
            return <AlertStripeInfo>Perioden er godkjent, ingen utbetaling.</AlertStripeInfo>;
        case Vedtaksperiodetilstand.Feilet:
            return <AlertStripeInfo>Utbetalingen feilet.</AlertStripeInfo>;
        case Vedtaksperiodetilstand.Annullert:
        case Vedtaksperiodetilstand.Avslag:
            return <AlertStripeInfo>Utbetalingen er sendt til annullering.</AlertStripeInfo>;
        case Vedtaksperiodetilstand.Oppgaver:
            return harOppgavereferanse ? <Utbetalingsdialog /> : <KanIkkeUtbetales />;
        default:
            return <AlertStripeInfo>Kunne ikke lese informasjon om sakens tilstand.</AlertStripeInfo>;
    }
};
