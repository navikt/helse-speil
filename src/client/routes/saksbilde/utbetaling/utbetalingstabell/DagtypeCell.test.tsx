import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { DagtypeCell } from './DagtypeCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('DagtypeCell', () => {
    it('rendrer tekst for dagtype', () => {
        render(<DagtypeCell typeUtbetalingsdag="Avslått" typeSykdomsdag="Syk" />);
        expect(screen.getByText('Syk (Avslått)')).toBeVisible();

        render(<DagtypeCell typeUtbetalingsdag="Foreldet" typeSykdomsdag="Syk" />);
        expect(screen.getByText('Syk (Foreldet)')).toBeVisible();

        render(<DagtypeCell typeUtbetalingsdag="Arbeidsgiverperiode" typeSykdomsdag="Syk" />);
        expect(screen.getByText('Syk (AGP)')).toBeVisible();
    });

    it('rendrer ikke dobbel typetekst dersom sykdomsdag og utbetalingsdag er samme type', () => {
        render(<DagtypeCell typeUtbetalingsdag="Foreldet" typeSykdomsdag="Foreldet" />);
        expect(screen.queryByText('Foreldet (Foreldet)')).toBeNull();
        expect(screen.getByText('Foreldet')).toBeVisible();
    });

    it('prioriterer typen til den overstyrte dagen', () => {
        const dag: UtbetalingstabellDag = { type: 'Ferie' } as UtbetalingstabellDag;
        render(<DagtypeCell typeUtbetalingsdag="Syk" typeSykdomsdag="Syk" overstyrtDag={dag} />);

        expect(screen.getByText('Ferie')).toBeVisible();
    });
});
