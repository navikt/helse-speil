import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
    enArbeidsforholdoverstyringhendelse,
    enDagoverstyringhendelse,
    enDokumenthendelse,
    enHistorikkhendelse,
    enInntektoverstyringhendelse,
    enNotathendelse,
    enUtbetalinghendelse,
} from '@test-data/hendelser';
import { RecoilWrapper } from '@test-wrappers';

import { Historikk } from './Historikk';
import { useFilteredHistorikk } from './state';

jest.mock('./state', () => ({
    useFilteredHistorikk: jest.fn().mockReturnValue([]),
    useFilterState: jest.fn().mockReturnValue(['Historikk']),
    useShowHistorikkState: jest.fn().mockReturnValue([true, () => null]),
}));

const mockHistorikk = (returnValue: Array<HendelseObject>): void => {
    (useFilteredHistorikk as jest.Mock).mockReturnValueOnce(returnValue);
};

describe('Historikk', () => {
    it('rendrer arbeidsforholdoverstyringhendelser', () => {
        mockHistorikk([enArbeidsforholdoverstyringhendelse()]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByText('Brukes i beregningen')).toBeVisible();
    });

    it('rendrer dagoverstyringhendelser', () => {
        mockHistorikk([enDagoverstyringhendelse()]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByText('Endret utbetalingsdager')).toBeVisible();
    });

    it('rendrer inntektoverstyringhendelser', () => {
        mockHistorikk([enInntektoverstyringhendelse()]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByText('Endret inntekt')).toBeVisible();
    });

    it('rendrer dokumenthendelser', () => {
        mockHistorikk([
            enDokumenthendelse('Inntektsmelding'),
            enDokumenthendelse('Sykmelding'),
            enDokumenthendelse('Søknad'),
        ]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        expect(screen.getByText('Inntektsmelding mottatt')).toBeVisible();
        expect(screen.getByText('Sykmelding mottatt')).toBeVisible();
        expect(screen.getByText('Søknad mottatt')).toBeVisible();
    });

    it('rendrer notathendelser', () => {
        mockHistorikk([enNotathendelse()]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByText('Notat')).toBeVisible();
    });

    it('rendrer utbetalinghendelser', () => {
        mockHistorikk([enUtbetalinghendelse()]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByText('Sendt til utbetaling')).toBeVisible();
    });

    it('rendrer historikkhendelser', () => {
        mockHistorikk([enHistorikkhendelse()]);
        render(<Historikk />, { wrapper: RecoilWrapper });

        expect(screen.getAllByRole('listitem')).toHaveLength(1);
        expect(screen.getByText('Godkjent og utbetalt')).toBeVisible();
    });
});
