import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dagtype } from 'internal-types';
import React from 'react';

import { EndringForm, lovligeTypeendringer, shortestListLength } from './EndringForm';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

jest.mock('../../../../hooks/revurdering', () => ({
    useRevurderingIsEnabled: () => true,
    useOverstyrRevurderingIsEnabled: () => true,
}));

jest.mock('../../../../featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
}));

describe('shortestListLength', () => {
    it('returnerer lengden av den korteste listen', () => {
        expect(shortestListLength([[1], [1, 2, 3], [1, 2]])).toEqual(1);
        expect(shortestListLength([[1], [], [1, 2]])).toEqual(0);
        expect(shortestListLength([[1, 2, 3], [1, 2], [1]])).toEqual(1);
    });
});

describe('lovligeTypeendringer', () => {
    it('returnerer lovlige typeendringer for dagtypevelgeren under revurdering', () => {
        expect(lovligeTypeendringer(true)).toEqual([Dagtype.Syk, Dagtype.Ferie]);
    });

    it('returnerer lovlige typeendringer for dagtypevelgeren under overstyring', () => {
        expect(lovligeTypeendringer(false)).toEqual([
            Dagtype.Syk,
            Dagtype.Ferie,
            Dagtype.Egenmelding,
            Dagtype.Permisjon,
        ]);
    });
});

describe('EndringForm', () => {
    it('disabler endringsknapp når ingen dager er markert', async () => {
        render(<EndringForm markerteDager={new Map()} toggleOverstyring={() => null} onSubmitEndring={() => null} />);

        await waitFor(() => {
            expect(screen.getByTestId('endre')).toBeDisabled();
        });
    });
    it('disabler grad når feil dagtyper velges', async () => {
        const markerteDager = new Map([['2020-01-01', { type: Dagtype.Ferie } as UtbetalingstabellDag]]);
        render(
            <EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} toggleOverstyring={() => null} />
        );

        userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[1]);

        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeDisabled();
            expect(screen.getByTestId('endre')).toBeEnabled();
        });
    });
});
