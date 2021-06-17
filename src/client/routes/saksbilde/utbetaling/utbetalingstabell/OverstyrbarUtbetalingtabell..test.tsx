import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { Dag, Dagtype } from 'internal-types';
import React from 'react';
import { enTidslinjeperiode } from 'test-data';

import { OverstyrbarUtbetalingstabell } from './OverstyrbarUtbetalingstabell';

const periode = enTidslinjeperiode();

describe('OverstyrbarUtbetalingtabell', () => {
    test('ikke vis grad når man overstyrer til ferie, egenmelding eller permisjon', () => {
        const sykdomstidslinje: Dag[] = [{ dato: dayjs(), type: Dagtype.Syk, gradering: 100 }];
        const utbetalingstidslinje: Dag[] = [{ dato: dayjs(), type: Dagtype.Syk, gradering: 100 }];
        const testPeriode = {
            ...periode,
            sykdomstidslinje: sykdomstidslinje,
            utbetalingstidslinje: utbetalingstidslinje,
        };

        render(
            <OverstyrbarUtbetalingstabell
                erRevurdering={false}
                periode={testPeriode}
                onCloseOverstyring={() => null}
                onPostOverstyring={(_dager: Dag[], _begrunnelse: string, _callback: () => void) => null}
            />
        );

        userEvent.selectOptions(screen.getByTestId('overstyrbar-dagtype'), ['Ferie']);
        expect(screen.queryByTestId('overstyrbar-grad')).toBeNull();

        userEvent.selectOptions(screen.getByTestId('overstyrbar-dagtype'), ['Egenmelding']);
        expect(screen.queryByTestId('overstyrbar-grad')).toBeNull();

        userEvent.selectOptions(screen.getByTestId('overstyrbar-dagtype'), ['Permisjon']);
        expect(screen.queryByTestId('overstyrbar-grad')).toBeNull();
    });

    test('grad på overstyring til syk', async () => {
        const dato = dayjs();

        const sykdomstidslinje: Dag[] = [{ dato: dato, type: Dagtype.Ferie }];
        const utbetalingstidslinje: Dag[] = [{ dato: dato, type: Dagtype.Ferie }];
        const testPeriode = {
            ...periode,
            sykdomstidslinje: sykdomstidslinje,
            utbetalingstidslinje: utbetalingstidslinje,
        };

        render(
            <OverstyrbarUtbetalingstabell
                erRevurdering={false}
                periode={testPeriode}
                onCloseOverstyring={() => null}
                onPostOverstyring={(_dager: Dag[], _begrunnelse: string, _callback: () => void) => null}
            />
        );
        expect(screen.queryByTestId('overstyrbar-dagtype')).toBeVisible();

        userEvent.selectOptions(screen.getByTestId('overstyrbar-dagtype'), ['Syk']);
        expect(screen.queryByTestId('overstyrbar-grad')).toBeVisible();
    });
});
