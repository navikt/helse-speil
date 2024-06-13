import React from 'react';

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import {
    ArbeidIkkeGjenopptattDag,
    Arbeidsdag,
    Egenmeldingsdag,
    Feriedag,
    Foreldrepengerdag,
    Omsorgspengerdag,
    Opplæringspengerdag,
    Permisjonsdag,
    Pleiepengerdag,
    Svangerskapspengerdag,
    Sykedag,
    SykedagNav,
} from '../utbetalingstabelldager';
import { EndringForm } from './EndringForm';
import { alleTypeendringer } from './endringFormUtils';

describe('Typeendringer', () => {
    it('returnerer typeendringer for dagtypevelgeren under overstyring', () => {
        expect(alleTypeendringer).toEqual([
            // Vi ble bedt om å fjerne muligheten for å endre til AAP og Dagpenger til å begynne med.
            // 'AAP',
            // 'Dagpenger',
            Sykedag,
            SykedagNav,
            Feriedag,
            ArbeidIkkeGjenopptattDag,
            Egenmeldingsdag,
            Permisjonsdag,
            Arbeidsdag,
            Foreldrepengerdag,
            Svangerskapspengerdag,
            Pleiepengerdag,
            Omsorgspengerdag,
            Opplæringspengerdag,
        ]);
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
        const markerteDager = new Map([['2020-01-01', { dag: Feriedag } as Utbetalingstabelldag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
        });
        expect(screen.getByTestId('endre')).toBeEnabled();
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { dag: Egenmeldingsdag } as Utbetalingstabelldag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
        });
        expect(screen.getByTestId('endre')).toBeEnabled();
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { dag: Feriedag } as Utbetalingstabelldag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
        });
        expect(screen.getByTestId('endre')).toBeEnabled();
    });
    it('disabler grad når egenmeldingsdag velges', async () => {
        const markerteDager = new Map([['2020-01-01', { dag: Arbeidsdag } as Utbetalingstabelldag]]);
        render(<EndringForm markerteDager={markerteDager} onSubmitEndring={() => null} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), screen.getAllByRole('option')[2]);

        await waitFor(() => {
            expect(screen.getByTestId('gradvelger')).toBeDisabled();
        });
        expect(screen.getByTestId('endre')).toBeEnabled();
    });
});
