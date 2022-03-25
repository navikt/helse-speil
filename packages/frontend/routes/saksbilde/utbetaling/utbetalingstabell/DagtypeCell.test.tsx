import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { DagtypeCell } from './DagtypeCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('DagtypeCell', () => {
    it('rendrer tekst for dagtype', () => {
        render(<DagtypeCell utbetalingsdagtype="Avslått" sykdomsdagtype="Syk" />);
        expect(screen.getByText('Syk (Avslått)')).toBeVisible();

        render(<DagtypeCell utbetalingsdagtype="Foreldet" sykdomsdagtype="Syk" />);
        expect(screen.getByText('Syk (Foreldet)')).toBeVisible();

        render(<DagtypeCell utbetalingsdagtype="Arbeidsgiverperiode" sykdomsdagtype="Syk" />);
        expect(screen.getByText('Syk (AGP)')).toBeVisible();
    });

    it('rendrer ikke dobbel typetekst dersom sykdomsdag og utbetalingsdag er samme type', () => {
        render(<DagtypeCell utbetalingsdagtype="Foreldet" sykdomsdagtype="Foreldet" />);
        expect(screen.queryByText('Foreldet (Foreldet)')).toBeNull();
        expect(screen.getByText('Foreldet')).toBeVisible();
    });

    it('prioriterer typen til den overstyrte dagen', () => {
        const dag: UtbetalingstabellDag = { type: 'Ferie' } as UtbetalingstabellDag;
        render(<DagtypeCell utbetalingsdagtype="Syk" sykdomsdagtype="Syk" overstyrtDag={dag} />);

        expect(screen.getByText('Ferie')).toBeVisible();
    });

    it('rendrer tekst for overstyringsindikatoren når vi overstyrer fra Syk til Ferie', () => {
        const dag: UtbetalingstabellDag = { type: 'Ferie' } as UtbetalingstabellDag;
        render(<DagtypeCell utbetalingsdagtype="Syk" sykdomsdagtype="Syk" overstyrtDag={dag} />);
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        userEvent.hover(indikator);
        expect(screen.getByText('Endret fra Syk')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(<DagtypeCell utbetalingsdagtype="Syk" sykdomsdagtype="Syk" />);
        expect(screen.queryByTestId('infotrekant')).toBeNull();
    });
});
