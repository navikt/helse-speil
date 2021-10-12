import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { TotalRow } from './TotalRow';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('TotalRow', () => {
    it('rendrer totalbeløp til utbetaling og totalt antall dager igjen', () => {
        const dager = [
            ['2021-01-01', { type: 'Syk', utbetaling: 1000, dagerIgjen: 122 }],
            ['2021-01-02', { type: 'Syk', utbetaling: 1000, dagerIgjen: 121 }],
            ['2021-01-03', { type: 'Avslått', utbetaling: 1000, dagerIgjen: 121 }],
            ['2021-01-04', { type: 'Avslått', utbetaling: 1000, dagerIgjen: 121 }],
            ['2021-01-05', { type: 'Syk', dagerIgjen: 121 }],
            ['2021-01-06', { type: 'Syk', utbetaling: 1000, dagerIgjen: 120 }],
        ] as [string, UtbetalingstabellDag][];
        render(<TotalRow dager={dager} />);

        expect(screen.getByText('3 dager')).toBeVisible();
        expect(screen.getByText('123')).toBeVisible();
    });
});
