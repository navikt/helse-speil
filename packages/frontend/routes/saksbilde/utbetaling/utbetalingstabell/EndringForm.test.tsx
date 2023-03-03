import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EndringForm, getLovligeTypeendringer } from './EndringForm';

let erProd = true;

jest.mock('@utils/featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
    erUtvikling: () => !erProd,
    erCoachEllerSuper: () => !erProd,
}));

describe('lovligeTypeendringer', () => {
    it('returnerer lovlige typeendringer for dagtypevelgeren under revurdering i prod', () => {
        erProd = true;
        expect(getLovligeTypeendringer({ revurderingIsEnabled: true })).toEqual(['Syk', 'Ferie']);
    });

    it('returnerer lovlige typeendringer for dagtypevelgeren under overstyring i prod', () => {
        erProd = true;
        expect(getLovligeTypeendringer()).toEqual(['Syk', 'Ferie', 'Egenmelding', 'Permisjon']);
    });
    it('returnerer lovlige typeendringer for dagtypevelgeren under revurdering i dev', () => {
        erProd = false;
        expect(getLovligeTypeendringer({ revurderingIsEnabled: true })).toEqual([
            'Syk',
            'Ferie',
            'Egenmelding',
            'Permisjon',
            'Arbeid',
        ]);
    });

    it('returnerer lovlige typeendringer for dagtypevelgeren under overstyring i dev', () => {
        erProd = false;
        expect(getLovligeTypeendringer()).toEqual(['Syk', 'Ferie', 'Egenmelding', 'Permisjon', 'Arbeid']);
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

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[1]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Egenmelding' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[1]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Ferie' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[1]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: 'Arbeid' } as UtbetalingstabellDag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[1]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
});
