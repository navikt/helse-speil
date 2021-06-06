import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs, { Dayjs } from 'dayjs';
import { Periodetype as Vedtaksperiodetype } from 'internal-types';
import React from 'react';
import { mappetVedtaksperiode } from 'test-data';

import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import { Periodetype, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';

import { Saksbildevarsler } from './Saksbildevarsler';

const enTidslinjeperiode = (
    tilstand: Tidslinjetilstand = Tidslinjetilstand.Oppgaver,
    fom: Dayjs = dayjs('2021-01-01'),
    tom: Dayjs = dayjs('2021-01-31'),
    periodetype: Periodetype = Periodetype.VEDTAKSPERIODE
): Tidslinjeperiode => {
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        beregningId: 'id1',
        unique: 'unique_id',
        fom: fom,
        tom: tom,
        type: periodetype,
        tilstand: tilstand,
        utbetalingstidslinje: [],
        sykdomstidslinje: [],
        organisasjonsnummer: '987654321',
        fullstendig: true,
        opprettet: dayjs('2020-01-01T:00:00:00'),
    };
};

describe('Saksbildevarsler', () => {
    test('viser infovarsel når saken har gått til utbetaling', () => {
        const periodeTilUtbetaling = enTidslinjeperiode(Tidslinjetilstand.TilUtbetaling);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periodeTilUtbetaling} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken har blitt utbetalt', () => {
        const utbetaltPeriode = enTidslinjeperiode(Tidslinjetilstand.Utbetalt);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={utbetaltPeriode} />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken er godkjent uten utbetaling', () => {
        const periodeUtenUtbetaling = enTidslinjeperiode(Tidslinjetilstand.IngenUtbetaling);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periodeUtenUtbetaling} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder ferie', () => {
        const ferieperiode = enTidslinjeperiode(Tidslinjetilstand.KunFerie);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={ferieperiode} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder permisjon', () => {
        const permisjonperiode = enTidslinjeperiode(Tidslinjetilstand.KunPermisjon);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={permisjonperiode} />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser feilvarsel om utbetaling har feilet', () => {
        const feiletperiode = enTidslinjeperiode(Tidslinjetilstand.Feilet);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={feiletperiode} />);
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser infovarsel om saken er annullert', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.Annullert);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periode} />);
        expect(screen.getByText('Utbetalingen er annullert.')).toBeVisible();
    });
    test('viser infovarsel om saken er sendt til annullering', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.TilAnnullering);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periode} />);
        expect(screen.getByText('Annullering venter.')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.AnnulleringFeilet);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periode} />);
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om saken har en aktiv oppgave men mangler oppgavereferanse', () => {
        const periode = { ...enTidslinjeperiode(Tidslinjetilstand.Oppgaver), oppgavereferanse: '' };
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periode} />);
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`
            )
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        const periode = enTidslinjeperiode(Tidslinjetilstand.Ukjent);
        render(<Saksbildevarsler vedtaksperiode={mappetVedtaksperiode()} aktivPeriode={periode} />);
        expect(screen.getByText('Kunne ikke lese informasjon om sakens tilstand.')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er kandidat for automatisering', () => {
        const periode = {
            ...mappetVedtaksperiode(),
            periodetype: Vedtaksperiodetype.Forlengelse,
            aktivitetslog: [],
            behandlet: false,
            automatiskBehandlet: false,
        };
        render(
            <Saksbildevarsler vedtaksperiode={periode} aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.Oppgaver)} />
        );
        expect(screen.getByText('Kandidat for automatisering')).toBeVisible();
    });
    test('viser infovarsel om vedtaksperioden er automatisk behandlet', () => {
        render(
            <Saksbildevarsler
                vedtaksperiode={mappetVedtaksperiode()}
                aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.UtbetaltAutomatisk)}
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
            <Saksbildevarsler aktivPeriode={enTidslinjeperiode(Tidslinjetilstand.Oppgaver)} vedtaksperiode={periode} />
        );
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });
});
