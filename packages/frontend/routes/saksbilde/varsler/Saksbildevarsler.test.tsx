import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { enTidslinjeperiode, mappetVedtaksperiode } from 'test-data';

import { Saksbildevarsler } from './Saksbildevarsler';

const saksbehandler: Saksbehandler = {
    oid: 'uuid',
    navn: 'enSaksbehandler',
    epost: 'saksbehandler@nav.no',
};
const annenSaksbehandler: Saksbehandler = {
    oid: 'uuid2',
    navn: 'To-Saksbehandler',
    epost: 'saksbehandler2@nav.no',
};

describe('Saksbildevarsler', () => {
    test('viser infovarsel når saken har gått til utbetaling', () => {
        const periodeTilUtbetaling = enTidslinjeperiode('tilUtbetaling');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periodeTilUtbetaling} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken har blitt utbetalt', () => {
        const utbetaltPeriode = enTidslinjeperiode('utbetalt');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={utbetaltPeriode} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når revurdert periode har gått til utbetaling', () => {
        const revurdertPeriode = enTidslinjeperiode('revurdert');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={revurdertPeriode} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken er til revurdering', () => {
        const periodeTilRevurdering = enTidslinjeperiode('revurderes');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periodeTilRevurdering} />);
        expect(screen.getByText('Revurdering er igangsatt og må fullføres.')).toBeVisible();
    });
    test('viser infovarsel når saken er godkjent uten utbetaling', () => {
        const periodeUtenUtbetaling = enTidslinjeperiode('ingenUtbetaling');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periodeUtenUtbetaling} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder ferie', () => {
        const ferieperiode = enTidslinjeperiode('kunFerie');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={ferieperiode} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder permisjon', () => {
        const permisjonperiode = enTidslinjeperiode('kunPermisjon');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={permisjonperiode} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser feilvarsel om utbetaling har feilet', () => {
        const feiletperiode = enTidslinjeperiode('feilet');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={feiletperiode} />);
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser infovarsel om saken er annullert', () => {
        const periode = enTidslinjeperiode('annullert');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periode} />);
        expect(screen.getByText('Utbetalingen er annullert.')).toBeVisible();
    });
    test('viser infovarsel om saken er sendt til annullering', () => {
        const periode = enTidslinjeperiode('tilAnnullering');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periode} />);
        expect(screen.getByText('Annullering venter.')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        const periode = enTidslinjeperiode('annulleringFeilet');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periode} />);
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om saken har en aktiv oppgave men mangler oppgavereferanse', () => {
        const periode = { ...enTidslinjeperiode('oppgaver'), oppgavereferanse: '' };
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periode} />);
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`
            )
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        const periode = enTidslinjeperiode('ukjent');
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} activePeriod={periode} />);
        expect(screen.getByText('Kunne ikke lese informasjon om sakens tilstand.')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er automatisk behandlet', () => {
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                activePeriod={enTidslinjeperiode('utbetaltAutomatisk')}
            />
        );
        expect(screen.getByText('Perioden er automatisk godkjent')).toBeVisible();
    });
    test('viser varslerState fra aktivitetsloggen', () => {
        const periode = {
            ...mappetVedtaksperiode(),
            aktivitetslog: ['Dette er en aktivitet', 'Dette er også en aktivitet'],
        };
        render(<Saksbildevarsler activePeriod={enTidslinjeperiode('oppgaver')} vedtaksperiode={periode} />);
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });
});
