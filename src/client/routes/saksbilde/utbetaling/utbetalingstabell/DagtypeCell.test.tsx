import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Dagtype } from 'internal-types';
import React from 'react';

import { DagtypeCell } from './DagtypeCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('DagtypeCell', () => {
    it('rendrer tekst for dagtype', () => {
        render(<DagtypeCell typeUtbetalingsdag={Dagtype.Avvist} typeSykdomsdag={Dagtype.Syk} />);
        expect(screen.getByText('Syk (Avslått)')).toBeVisible();

        render(<DagtypeCell typeUtbetalingsdag={Dagtype.Foreldet} typeSykdomsdag={Dagtype.Syk} />);
        expect(screen.getByText('Syk (Foreldet)')).toBeVisible();

        render(<DagtypeCell typeUtbetalingsdag={Dagtype.Arbeidsgiverperiode} typeSykdomsdag={Dagtype.Syk} />);
        expect(screen.getByText('Syk (AGP)')).toBeVisible();
    });

    it('prioriterer typen til den overstyrte dagen', () => {
        const dag: UtbetalingstabellDag = { type: Dagtype.Ferie } as UtbetalingstabellDag;
        render(<DagtypeCell typeUtbetalingsdag={Dagtype.Syk} typeSykdomsdag={Dagtype.Syk} overstyrtDag={dag} />);

        expect(screen.getByText('Ferie')).toBeVisible();
    });
});
