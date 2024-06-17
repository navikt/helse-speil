import React from 'react';

import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { TestCellWrapper } from '@test-wrappers';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GradCell } from './GradCell';

describe('GradCell', () => {
    it('skal tegne en overstyringstrekant med tekst når grad går fra 100 % til 0 %', async () => {
        render(
            <TestCellWrapper>
                <GradCell
                    tabelldag={getUtbetalingstabellDag({ grad: 100 })}
                    overstyrtDag={getUtbetalingstabellDag({ grad: 0 })}
                />
            </TestCellWrapper>,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        await userEvent.hover(indikator);
        expect(screen.getByText('Endret fra 100 %')).toBeVisible();
    });

    it('skal tegne en overstyringstrekant med tekst når grad går fra null til 100 %', async () => {
        render(
            <TestCellWrapper>
                <GradCell
                    tabelldag={getUtbetalingstabellDag({ grad: null })}
                    overstyrtDag={getUtbetalingstabellDag()}
                />
            </TestCellWrapper>,
        );
        const indikator = screen.getByTestId('infotrekant');
        expect(indikator).toBeVisible();

        await userEvent.hover(indikator);
        expect(screen.getByText('Endret fra dag uten grad')).toBeVisible();
    });

    it('rendrer ikke infotrekant når vi ikke overstyrer', () => {
        render(
            <TestCellWrapper>
                <GradCell tabelldag={getUtbetalingstabellDag()} />
            </TestCellWrapper>,
        );
        expect(screen.queryByTestId('infotrekant')).not.toBeInTheDocument();
    });
});
