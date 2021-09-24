import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import { GradCell } from './GradCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('GradCell', () => {
    const overstyrtTilNullProsentSyk: UtbetalingstabellDag = {
        type: 'Syk',
        gradering: 0,
        dato: dayjs(),
        isMaksdato: true,
        sykdomsdag: { type: 'Syk', kilde: 'Sykmelding' },
    };
    it('skal tegne en overstyringstrekant med tekst når grad går fra 100 % til 0 %', function () {
        render(<GradCell type="Syk" grad={100} overstyrtDag={overstyrtTilNullProsentSyk} />);
        expect(screen.getByTestId('overstyringsindikator')).toBeVisible();
    });
});
