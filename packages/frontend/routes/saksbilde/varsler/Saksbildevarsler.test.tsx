import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { Saksbildevarsler } from './Saksbildevarsler';

describe('Saksbildevarsler', () => {
    test('viser infovarsel når saken har gått til utbetaling', () => {
        render(<Saksbildevarsler periodState="tilUtbetaling" />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken har blitt utbetalt', () => {
        render(<Saksbildevarsler periodState="utbetalt" />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når revurdert periode har gått til utbetaling', () => {
        render(<Saksbildevarsler periodState="revurdert" />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken er godkjent uten utbetaling', () => {
        render(<Saksbildevarsler periodState="ingenUtbetaling" />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder ferie', () => {
        render(<Saksbildevarsler periodState="kunFerie" />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder permisjon', () => {
        render(<Saksbildevarsler periodState="kunPermisjon" />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser feilvarsel om utbetaling har feilet', () => {
        render(<Saksbildevarsler periodState="utbetalingFeilet" />);
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser infovarsel om saken er annullert', () => {
        render(<Saksbildevarsler periodState="annullert" />);
        expect(screen.getByText('Utbetalingen er annullert.')).toBeVisible();
    });
    test('viser infovarsel om saken er sendt til annullering', () => {
        render(<Saksbildevarsler periodState="tilAnnullering" />);
        expect(screen.getByText('Annullering venter.')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        render(<Saksbildevarsler periodState="annulleringFeilet" />);
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om saken har en aktiv oppgave men mangler oppgavereferanse', () => {
        render(<Saksbildevarsler periodState="tilGodkjenning" />);
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`
            )
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        render(<Saksbildevarsler periodState="ukjent" />);
        expect(screen.getByText('Kunne ikke lese informasjon om sakens tilstand.')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er automatisk behandlet', () => {
        render(<Saksbildevarsler periodState="tilUtbetalingAutomatisk" />);
        expect(screen.getByText('Perioden er automatisk godkjent')).toBeVisible();
    });
    test('viser varslerState fra aktivitetsloggen', () => {
        render(
            <Saksbildevarsler
                periodState="utbetalt"
                varslerForGenerasjon={[
                    { definisjonId: 'EN_ID', generasjonId: 'EN_ID', kode: 'EN_KODE', tittel: 'Dette er en aktivitet' },
                    {
                        definisjonId: 'EN_ID',
                        generasjonId: 'EN_ID',
                        kode: 'EN_KODE',
                        tittel: 'Dette er også en aktivitet',
                    },
                ]}
            />
        );
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });
});
