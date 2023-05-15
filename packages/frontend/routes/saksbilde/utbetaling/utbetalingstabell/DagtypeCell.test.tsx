import React from 'react';

import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DagtypeCell } from './DagtypeCell';

describe('DagtypeCell', () => {
    it('rendrer tekst for dagtype', () => {
        render(<DagtypeCell dag={getUtbetalingstabellDag({ erAvvist: true })} />);
        expect(screen.getByText('Syk (Avslått)')).toBeVisible();

        render(<DagtypeCell dag={getUtbetalingstabellDag({ erForeldet: true })} />);
        expect(screen.getByText('Syk (Foreldet)')).toBeVisible();

        render(<DagtypeCell dag={getUtbetalingstabellDag({ erAGP: true })} />);
        expect(screen.getByText('Syk (AGP)')).toBeVisible();
    });

    it('prioriterer typen til den overstyrte dagen', () => {
        render(
            <DagtypeCell dag={getUtbetalingstabellDag()} overstyrtDag={getUtbetalingstabellDag({ type: 'Ferie' })} />,
        );

        expect(screen.getByText('Ferie')).toBeVisible();
    });

    it('rendrer tekst for overstyringsindikatoren når vi overstyrer fra Syk til Ferie', () => {
        render(
            <DagtypeCell dag={getUtbetalingstabellDag()} overstyrtDag={getUtbetalingstabellDag({ type: 'Ferie' })} />,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        userEvent.hover(indikator);
        expect(screen.getByText('Endret fra Syk')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(<DagtypeCell dag={getUtbetalingstabellDag()} overstyrtDag={getUtbetalingstabellDag()} />);
        expect(screen.queryByTestId('infotrekant')).toBeNull();
    });
});
