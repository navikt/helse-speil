import React, { useContext } from 'react';
import Panel from 'nav-frontend-paneler';
import styled from '@emotion/styled';
import { Undertittel } from 'nav-frontend-typografi';
import { useTranslation } from 'react-i18next';
import { Utbetalingsdialog } from './Utbetalingsdialog';
import { Vedtaksperiodetilstand } from 'internal-types';
import { FetchedPersonContext, PersonContext } from '../../../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';

const Container = styled(Panel)`
    display: flex;
    flex-direction: column;
    flex: 1;
    border-left: 1px solid #c6c2be;
    overflow-x: hidden;

    .alertstripe {
        margin-bottom: 1rem;
    }

    .alertstripe__tekst {
        max-width: 100%;
    }

    .p:last-child {
        margin-top: 0.5rem;
    }

    > .typo-undertittel {
        margin-bottom: 1rem;
    }
`;

const KanIkkeUtbetales = () => (
    <AlertStripeAdvarsel>
        <p>Denne perioden kan ikke utbetales.</p>
        <p>Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.</p>
    </AlertStripeAdvarsel>
);

const Utbetalingspanel = () => {
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

export const Utbetaling = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <Undertittel>{t('oppsummering.utbetaling')}</Undertittel>
            <Utbetalingspanel />
        </Container>
    );
};
