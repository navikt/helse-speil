import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { GradCell } from './GradCell';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';

describe('GradCell', () => {
    it('skal tegne en overstyringstrekant med tekst når grad går fra 100 % til 0 %', () => {
        render(
            <GradCell
                dag={getUtbetalingstabellDag({ grad: 100 })}
                overstyrtDag={getUtbetalingstabellDag({ grad: 0 })}
            />,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        userEvent.hover(indikator);
        expect(screen.getByText('Endret fra 100 %')).toBeVisible();
    });

    it('skal tegne en overstyringstrekant med tekst når grad går fra null til 100 %', () => {
        render(<GradCell dag={getUtbetalingstabellDag({ grad: null })} overstyrtDag={getUtbetalingstabellDag()} />);
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        userEvent.hover(indikator);
        expect(screen.getByText('Endret fra dag uten grad')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(<GradCell dag={getUtbetalingstabellDag()} />);
        expect(screen.queryByTestId('infotrekant')).toBeNull();
    });
});
