import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EndringForm } from './EndringForm';
import { typeendringer } from './endringFormUtils';

let erProd = true;

jest.mock('@utils/featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
}));

describe('Typeendringer', () => {
    it('returnerer typeendringer for dagtypevelgeren under overstyring', () => {
        erProd = true;
        expect(typeendringer).toEqual(['Syk', 'Syk (NAV)', 'Ferie', 'Egenmelding', 'Permisjon', 'Arbeid']);
    });
});

describe('EndringForm', () => {
    it('disabler endringsknapp når ingen dager er markert', async () => {
        render(<EndringForm markerteDager={new Map()} onSubmitEndring={() => null} />);

        await waitFor(() => {
            expect(screen.getByTestId('endre')).toBeDisabled();
        });
    });
    it('disabler grad når ferie velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Ferie' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Egenmelding' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Ferie' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Arbeid' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
});