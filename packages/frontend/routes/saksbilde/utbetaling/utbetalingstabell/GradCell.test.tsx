import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';

import { GradCell } from './GradCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

describe('GradCell', () => {
    it('skal tegne en overstyringstrekant med tekst når grad går fra 100 % til 0 %', () => {
        const overstyrtTilNullProsentSyk: UtbetalingstabellDag = {
            type: 'Syk',
            gradering: 0,
            dato: dayjs(),
            isMaksdato: true,
            sykdomsdag: { type: 'Syk', kilde: 'Sykmelding' },
        };
        render(<GradCell type="Syk" grad={100} overstyrtDag={overstyrtTilNullProsentSyk} />);
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        userEvent.hover(indikator);
        expect(screen.getByText('Endret fra 100 %')).toBeVisible();
    });

    it('skal tegne en overstyringstrekant med tekst når grad går fra null til 100 %', () => {
        const overstyrtTilHundreProsentSyk: UtbetalingstabellDag = {
            type: 'Syk',
            gradering: 100,
            dato: dayjs(),
            isMaksdato: true,
            sykdomsdag: { type: 'Syk', kilde: 'Sykmelding' },
        };
        render(<GradCell type="Egenmelding" overstyrtDag={overstyrtTilHundreProsentSyk} />);
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        userEvent.hover(indikator);
        expect(screen.getByText('Endret fra dag uten grad')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(<GradCell type="Egenmelding" grad={100} />);
        expect(screen.queryByTestId('infotrekant')).toBeNull();
    });
});
