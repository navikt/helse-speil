import React from 'react';

import { Utbetalingstabelldag } from '@/routes/saksbilde/utbetaling/utbetalingstabell/types';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { TotalRow } from './TotalRow';
import { Sykedag } from './utbetalingstabelldager';

describe('TotalRow', () => {
    it('rendrer totalbeløp til utbetaling', () => {
        const dager = [
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 122 },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 121 },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 121, erAvvist: true },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 121, erAvvist: true },
            { dag: Sykedag, dagerIgjen: 121 },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 120 },
        ] as Utbetalingstabelldag[];
        render(<TotalRow dager={dager} overstyrer={false} />);

        expect(screen.getByText('3 dager')).toBeVisible();
    });

    it('rendrer antall utbetalingsdager riktig når vi går tom for dager igjen', () => {
        const dager = [
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 2 },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 1 },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 1, erAvvist: true },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 1, erAvvist: true },
            { dag: Sykedag, dagerIgjen: 1 },
            { dag: Sykedag, personbeløp: 1000, dagerIgjen: 0 },
        ] as Utbetalingstabelldag[];
        render(<TotalRow dager={dager} overstyrer={false} />);

        expect(screen.getByText('3 dager')).toBeVisible();
    });
});
