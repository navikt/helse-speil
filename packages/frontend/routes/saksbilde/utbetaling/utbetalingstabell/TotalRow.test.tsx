import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { TotalRow } from './TotalRow';

describe('TotalRow', () => {
    it('rendrer totalbeløp til utbetaling', () => {
        const dager = [
            { type: 'Syk', personbeløp: 1000, dagerIgjen: 122 },
            { type: 'Syk', personbeløp: 1000, dagerIgjen: 121 },
            { type: 'Avslått', personbeløp: 1000, dagerIgjen: 121 },
            { type: 'Avslått', personbeløp: 1000, dagerIgjen: 121 },
            { type: 'Syk', dagerIgjen: 121 },
            { type: 'Syk', personbeløp: 1000, dagerIgjen: 120 },
        ] as UtbetalingstabellDag[];
        render(<TotalRow dager={dager} overstyrer={false} />);

        expect(screen.getByText('3 dager')).toBeVisible();
    });

    it('rendrer antall utbetalingsdager riktig når vi går tom for dager igjen', () => {
        const dager = [
            { type: 'Syk', personbeløp: 1000, dagerIgjen: 2 },
            { type: 'Syk', personbeløp: 1000, dagerIgjen: 1 },
            { type: 'Avslått', personbeløp: 1000, dagerIgjen: 1 },
            { type: 'Avslått', personbeløp: 1000, dagerIgjen: 1 },
            { type: 'Syk', dagerIgjen: 1 },
            { type: 'Syk', personbeløp: 1000, dagerIgjen: 0 },
        ] as UtbetalingstabellDag[];
        render(<TotalRow dager={dager} overstyrer={false} />);

        expect(screen.getByText('3 dager')).toBeVisible();
    });
});
