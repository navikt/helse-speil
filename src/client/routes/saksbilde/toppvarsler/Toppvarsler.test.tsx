import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Periodetype, Vedtaksperiodetilstand } from 'internal-types';
import React from 'react';
import { mappetVedtaksperiode } from 'test-data';

import { Toppvarsler } from './Toppvarsler';

const vedtaksperiodeMedTilstand = (tilstand: Vedtaksperiodetilstand) => ({
    ...mappetVedtaksperiode(),
    tilstand: tilstand,
});

describe('Toppvarsler', () => {
    test('viser infovarsel når saken har gått til utbetaling', () => {
        const periodeTilUtbetaling = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.TilUtbetaling);
        render(<Toppvarsler vedtaksperiode={periodeTilUtbetaling} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken har blitt utbetalt', () => {
        const utbetaltPeriode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Utbetalt);
        render(<Toppvarsler vedtaksperiode={utbetaltPeriode} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken er godkjent uten utbetaling', () => {
        const periodeUtenUtbetaling = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.IngenUtbetaling);
        render(<Toppvarsler vedtaksperiode={periodeUtenUtbetaling} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder ferie', () => {
        const ferieperiode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.KunFerie);
        render(<Toppvarsler vedtaksperiode={ferieperiode} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder permisjon', () => {
        const permisjonperiode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.KunPermisjon);
        render(<Toppvarsler vedtaksperiode={permisjonperiode} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser feilvarsel om utbetaling har feilet', () => {
        const feiletperiode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Feilet);
        render(<Toppvarsler vedtaksperiode={feiletperiode} />);
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser infovarsel om saken er annullert', () => {
        const periode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Annullert);
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Utbetalingen er annullert.')).toBeVisible();
    });
    test('viser infovarsel om saken er sendt til annullering', () => {
        const periode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.TilAnnullering);
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Annullering venter.')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        const periode = vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.AnnulleringFeilet);
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om saken har en aktiv oppgave men mangler oppgavereferanse', () => {
        const periode = { ...vedtaksperiodeMedTilstand(Vedtaksperiodetilstand.Oppgaver), oppgavereferanse: '' };
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`
            )
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        const periode = { ...mappetVedtaksperiode(), tilstand: '' as Vedtaksperiodetilstand };
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Kunne ikke lese informasjon om sakens tilstand.')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er kandidat for automatisering', () => {
        const periode = {
            ...mappetVedtaksperiode(),
            periodetype: Periodetype.Forlengelse,
            aktivitetslog: [],
            behandlet: false,
            automatiskBehandlet: false,
        };
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Kandidat for automatisering')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er automatisk behandlet', () => {
        const periode = {
            ...mappetVedtaksperiode(),
            automatiskBehandlet: true,
        };
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Perioden er automatisk godkjent')).toBeVisible();
    });
    test('viser varslerState fra aktivitetsloggen', () => {
        const periode = {
            ...mappetVedtaksperiode(),
            aktivitetslog: ['Dette er en aktivitet', 'Dette er også en aktivitet'],
        };
        render(<Toppvarsler vedtaksperiode={periode} />);
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });
});
