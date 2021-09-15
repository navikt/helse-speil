import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Dagtype } from 'internal-types';
import React from 'react';

import { TotalRow } from './TotalRow';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('TotalRow', () => {
    it('rendrer totalbeløp til utbetaling og totalt antall dager igjen', () => {
        const dager = [
            ['2021-01-01', { type: Dagtype.Syk, utbetaling: 1000 }],
            ['2021-01-02', { type: Dagtype.Syk, utbetaling: 1000 }],
            ['2021-01-03', { type: Dagtype.Avvist, utbetaling: 1000 }],
            ['2021-01-04', { type: Dagtype.Avvist, utbetaling: 1000 }],
            ['2021-01-05', { type: Dagtype.Syk }],
            ['2021-01-06', { type: Dagtype.Syk, utbetaling: 1000 }],
        ] as [string, UtbetalingstabellDag][];
        render(<TotalRow dager={dager} dagerIgjen={123} />);

        expect(screen.getByText('3 dager')).toBeVisible();
        expect(screen.getByText('123')).toBeVisible();
    });
});
