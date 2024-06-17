import React from 'react';

import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { TestCellWrapper } from '@test-wrappers';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DagtypeCell } from './DagtypeCell';
import { Feriedag } from './utbetalingstabelldager';

describe('DagtypeCell', () => {
    it('rendrer tekst for dagtype', () => {
        render(
            <TestCellWrapper>
                <DagtypeCell tabelldag={getUtbetalingstabellDag({ erAvvist: true })} />
            </TestCellWrapper>,
        );
        expect(screen.getByText('Syk (Avslått)')).toBeVisible();

        render(
            <TestCellWrapper>
                <DagtypeCell tabelldag={getUtbetalingstabellDag({ erForeldet: true })} />
            </TestCellWrapper>,
        );
        expect(screen.getByText('Syk (Foreldet)')).toBeVisible();

        render(
            <TestCellWrapper>
                <DagtypeCell tabelldag={getUtbetalingstabellDag({ erAGP: true })} />
            </TestCellWrapper>,
        );
        expect(screen.getByText('Syk (AGP)')).toBeVisible();
    });

    it('prioriterer typen til den overstyrte dagen', () => {
        render(
            <TestCellWrapper>
                <DagtypeCell
                    tabelldag={getUtbetalingstabellDag()}
                    overstyrtDag={getUtbetalingstabellDag({ dag: Feriedag })}
                />
            </TestCellWrapper>,
        );

        expect(screen.getByText('Ferie')).toBeVisible();
    });

    it('rendrer tekst for overstyringsindikatoren når vi overstyrer fra Syk til Ferie', async () => {
        render(
            <TestCellWrapper>
                <DagtypeCell
                    tabelldag={getUtbetalingstabellDag()}
                    overstyrtDag={getUtbetalingstabellDag({ dag: Feriedag })}
                />
            </TestCellWrapper>,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        await userEvent.hover(indikator);
        expect(screen.getByText('Endret fra Syk')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(
            <TestCellWrapper>
                <DagtypeCell tabelldag={getUtbetalingstabellDag()} />
            </TestCellWrapper>,
        );
        expect(screen.queryByTestId('infotrekant')).not.toBeInTheDocument();
    });

    it('rendrer infotrekant når vi legger til dag', async () => {
        render(
            <TestCellWrapper>
                <DagtypeCell tabelldag={getUtbetalingstabellDag()} overstyrtDag={getUtbetalingstabellDag()} />
            </TestCellWrapper>,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        await userEvent.hover(indikator);
        expect(
            screen.getByText('Ny dag. Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig'),
        ).toBeVisible();
    });
});
