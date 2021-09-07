import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { Dagtype } from 'internal-types';
import React from 'react';

import { EndringForm, lovligeTypeendringer, shortestListLength } from './EndringForm';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

jest.mock('../../../../hooks/useRevurderingIsEnabled', () => ({
    useRevurderingIsEnabled: () => true,
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
        expect(lovligeTypeendringer([Dagtype.Syk], true)).toEqual([Dagtype.Syk, Dagtype.Ferie]);
        expect(lovligeTypeendringer([Dagtype.Ferie], true)).toEqual([Dagtype.Syk, Dagtype.Ferie]);
        expect(lovligeTypeendringer([Dagtype.Syk, Dagtype.Ferie], true)).toEqual([Dagtype.Syk, Dagtype.Ferie]);
        expect(lovligeTypeendringer([Dagtype.Syk, Dagtype.Foreldet], true)).toHaveLength(0);
        expect(lovligeTypeendringer([Dagtype.Permisjon], true)).toHaveLength(0);
        expect(lovligeTypeendringer([Dagtype.Arbeidsdag], true)).toHaveLength(0);
        expect(lovligeTypeendringer([Dagtype.Arbeidsgiverperiode], true)).toHaveLength(0);
    });

    it('returnerer lovlige typeendringer for dagtypevelgeren under overstyring', () => {
        expect(lovligeTypeendringer([Dagtype.Syk], false)).toEqual([
            Dagtype.Syk,
            Dagtype.Ferie,
            Dagtype.Egenmelding,
            Dagtype.Permisjon,
        ]);
        expect(lovligeTypeendringer([Dagtype.Ferie], false)).toEqual([
            Dagtype.Syk,
            Dagtype.Ferie,
            Dagtype.Egenmelding,
            Dagtype.Permisjon,
        ]);
        expect(lovligeTypeendringer([Dagtype.Egenmelding], false)).toEqual([
            Dagtype.Syk,
            Dagtype.Ferie,
            Dagtype.Egenmelding,
            Dagtype.Permisjon,
        ]);
        expect(lovligeTypeendringer([Dagtype.Permisjon], false)).toEqual([
            Dagtype.Syk,
            Dagtype.Ferie,
            Dagtype.Egenmelding,
            Dagtype.Permisjon,
        ]);
        expect(lovligeTypeendringer([Dagtype.Syk, Dagtype.Foreldet], false)).toHaveLength(0);
        expect(lovligeTypeendringer([Dagtype.Arbeidsdag], false)).toHaveLength(0);
        expect(lovligeTypeendringer([Dagtype.Arbeidsgiverperiode], false)).toHaveLength(0);
    });
});

describe('EndringForm', () => {
    it('disabler grad og dagtype når ingen dager er markert', async () => {
        render(
            <EndringForm
                markerteDager={new Map()}
                overstyrteDager={new Map()}
                toggleOverstyring={() => null}
                onSubmitEndring={() => null}
            />
        );

        await waitFor(() => {
            expect(screen.getByRole('combobox')).toBeDisabled();
            expect(screen.getByRole('textbox')).toBeDisabled();
        });
    });
    it('disabler grad når feil dagtyper er markert', async () => {
        const markerteDager = new Map([['2020-01-01', { type: Dagtype.Ferie } as UtbetalingstabellDag]]);
        render(
            <EndringForm
                markerteDager={markerteDager}
                overstyrteDager={new Map()}
                onSubmitEndring={() => null}
                toggleOverstyring={() => null}
            />
        );

        await waitFor(() => {
            expect(screen.getByRole('textbox')).toBeDisabled();
        });
    });
});
