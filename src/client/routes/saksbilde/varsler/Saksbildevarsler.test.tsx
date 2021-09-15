import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Saksbehandler, Tidslinjetilstand, TildelingType } from 'internal-types';
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
        const periodeTilUtbetaling = enTidslinjeperiode(Tidslinjetilstand.TilUtbetaling);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periodeTilUtbetaling}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken har blitt utbetalt', () => {
        const utbetaltPeriode = enTidslinjeperiode(Tidslinjetilstand.Utbetalt);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={utbetaltPeriode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når revurdert periode har gått til utbetaling', () => {
        const revurdertPeriode = enTidslinjeperiode(Tidslinjetilstand.Revurdert);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={revurdertPeriode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken er til revurdering', () => {
        const periodeTilRevurdering = enTidslinjeperiode(Tidslinjetilstand.Revurderes);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periodeTilRevurdering}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Revurdering er igangsatt og må fullføres.')).toBeVisible();
    });
    test('viser infovarsel når saken er godkjent uten utbetaling', () => {
        const periodeUtenUtbetaling = enTidslinjeperiode(Tidslinjetilstand.IngenUtbetaling);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periodeUtenUtbetaling}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder ferie', () => {
        const ferieperiode = enTidslinjeperiode(Tidslinjetilstand.KunFerie);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={ferieperiode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder permisjon', () => {
        const permisjonperiode = enTidslinjeperiode(Tidslinjetilstand.KunPermisjon);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={permisjonperiode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser feilvarsel om utbetaling har feilet', () => {
        const feiletperiode = enTidslinjeperiode(Tidslinjetilstand.Feilet);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={feiletperiode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser infovarsel om saken er annullert', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.Annullert);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Utbetalingen er annullert.')).toBeVisible();
    });
    test('viser infovarsel om saken er sendt til annullering', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.TilAnnullering);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Annullering venter.')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.AnnulleringFeilet);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om saken har en aktiv oppgave men mangler oppgavereferanse', () => {
        const periode = { ...enTidslinjeperiode(Tidslinjetilstand.Oppgaver), oppgavereferanse: '' };
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periode}
                saksbehandler={saksbehandler}
            />
        );
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`
            )
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.Ukjent);
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={periode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Kunne ikke lese informasjon om sakens tilstand.')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er automatisk behandlet', () => {
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.UtbetaltAutomatisk)}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Perioden er automatisk godkjent')).toBeVisible();
    });
    test('viser varslerState fra aktivitetsloggen', () => {
        const periode = {
            ...mappetVedtaksperiode(),
            aktivitetslog: ['Dette er en aktivitet', 'Dette er også en aktivitet'],
        };
        render(
            <Saksbildevarsler
                aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.Oppgaver)}
                vedtaksperiode={periode}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });
    test('viser infovarsel dersom oppgaven er tildelt en annen saksbehandler', () => {
        const periode = {
            ...mappetVedtaksperiode(),
        };
        const tildeling: TildelingType = {
            saksbehandler: annenSaksbehandler,
            påVent: false,
        };
        render(
            <Saksbildevarsler
                aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.Oppgaver)}
                vedtaksperiode={periode}
                tildeling={tildeling}
                saksbehandler={saksbehandler}
            />
        );
        expect(screen.getByText('Saken er allerede tildelt til To-Saksbehandler')).toBeVisible();
    });
});
