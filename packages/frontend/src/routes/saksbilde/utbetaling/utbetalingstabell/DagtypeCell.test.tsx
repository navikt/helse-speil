import React from 'react';

import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DagtypeCell } from './DagtypeCell';
import { Feriedag } from './utbetalingstabelldager';

describe('DagtypeCell', () => {
    it('rendrer tekst for dagtype', () => {
        render(<DagtypeCell tabelldag={getUtbetalingstabellDag({ erAvvist: true })} />);
        expect(screen.getByText('Syk (Avslått)')).toBeVisible();

        render(<DagtypeCell tabelldag={getUtbetalingstabellDag({ erForeldet: true })} />);
        expect(screen.getByText('Syk (Foreldet)')).toBeVisible();

        render(<DagtypeCell tabelldag={getUtbetalingstabellDag({ erAGP: true })} />);
        expect(screen.getByText('Syk (AGP)')).toBeVisible();
    });

    it('prioriterer typen til den overstyrte dagen', () => {
        render(
            <DagtypeCell
                tabelldag={getUtbetalingstabellDag()}
                overstyrtDag={getUtbetalingstabellDag({ dag: Feriedag })}
            />,
        );

        expect(screen.getByText('Ferie')).toBeVisible();
    });

    it('rendrer tekst for overstyringsindikatoren når vi overstyrer fra Syk til Ferie', async () => {
        render(
            <DagtypeCell
                tabelldag={getUtbetalingstabellDag()}
                overstyrtDag={getUtbetalingstabellDag({ dag: Feriedag })}
            />,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        await userEvent.hover(indikator);
        expect(screen.getByText('Endret fra Syk')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(<DagtypeCell tabelldag={getUtbetalingstabellDag()} />);
        expect(screen.queryByTestId('infotrekant')).not.toBeInTheDocument();
    });

    it('rendrer infotrekant når vi legger til dag', async () => {
        render(<DagtypeCell tabelldag={getUtbetalingstabellDag()} overstyrtDag={getUtbetalingstabellDag()} />);
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        await userEvent.hover(indikator);
        expect(
            screen.getByText('Ny dag. Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig'),
        ).toBeVisible();
    });
});
