import { vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { Sykedag } from '../utbetalingstabelldager';
import { GraderteAndreYtelserForm } from './GraderteAndreYtelserForm';

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => true,
}));

describe('GraderteAndreYtelserForm', () => {
    it('viser gradfeltet igjen når en ytelse velges, velges bort og velges på nytt', async () => {
        const markerteDager = new Map([['2020-01-01', { dag: Sykedag, grad: 100 } as Utbetalingstabelldag]]);
        render(<GraderteAndreYtelserForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        const velger = screen.getByRole('combobox', { name: 'Velg annen ytelse' });
        await userEvent.click(velger);
        await userEvent.click(screen.getByRole('option', { name: 'Pleiepenger' }));
        await userEvent.click(screen.getByRole('option', { name: 'Pleiepenger' }));
        await userEvent.click(screen.getByRole('option', { name: 'Pleiepenger' }));

        expect(screen.getByRole('textbox', { name: 'Pleiepenger' })).toBeInTheDocument();
    });
});
