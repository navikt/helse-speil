import React from 'react';
import { render, screen } from '@testing-library/react';
import { HoverInfo } from './HoverInfo';
import { mappetVedtaksperiode } from 'test-data';
import '@testing-library/jest-dom/extend-expect';
import { Dagtype, Utbetalingsdag } from 'internal-types';
import dayjs from 'dayjs';

const enPeriode = mappetVedtaksperiode();

const enArbeidsgiverperiodedag: Utbetalingsdag = {
    dato: dayjs('2020-01-01'),
    type: Dagtype.Arbeidsgiverperiode,
};

describe('HoverInfo', () => {
    test('viser antall arbeidsgiverperiodedager', () => {
        const periodeMedArbeidsgiverperiodedager = {
            ...enPeriode,
            utbetalingstidslinje: [
                ...new Array(16).fill(enArbeidsgiverperiodedag),
                ...enPeriode.utbetalingstidslinje.slice(16),
            ],
        };
        render(<HoverInfo vedtaksperiode={periodeMedArbeidsgiverperiodedager} />);
        expect(screen.getByText('Arbeidsgiverperiode: 16 dager')).toBeVisible();
    });
    test('viser antall feriedager', () => {
        const periodeMedFerie = {
            ...enPeriode,
            utbetalingstidslinje: [...enPeriode.utbetalingstidslinje, { dato: dayjs(), type: Dagtype.Ferie }],
        };
        render(<HoverInfo vedtaksperiode={periodeMedFerie} />);
        expect(screen.getByText('Ferie: 1 dager')).toBeVisible();
    });
    test('viser fom og tom for perioden', () => {
        render(<HoverInfo vedtaksperiode={enPeriode} />);
        expect(screen.getByText('Periode: 01.01.2020 - 31.01.2020')).toBeVisible();
    });

    test('viser antall dager igjen for fullverdig vedtaksperiode', () => {
        const periodeMedDagerIgjen = { ...enPeriode, vilkår: { dagerIgjen: { gjenståendeDager: 10 } } };
        render(<HoverInfo vedtaksperiode={periodeMedDagerIgjen} />);
        expect(screen.getByText('Dager igjen: 10')).toHaveStyle('color:#3e3832');
    });

    test('viser antall dager igjen for fullverdig vedtaksperiode med rødt hvis null', () => {
        const periodeMedDagerIgjen = { ...enPeriode, vilkår: { dagerIgjen: { gjenståendeDager: 0 } } };
        render(<HoverInfo vedtaksperiode={periodeMedDagerIgjen} />);
        expect(screen.getByText('Dager igjen: 0')).toHaveStyle('color:#A13A28');
    });

    test('Viser ikke dager igjen for ufullstendig periode', () => {
        const periodeMedDagerIgjen = { ...enPeriode, kanVelges: false };
        render(<HoverInfo vedtaksperiode={periodeMedDagerIgjen} />);
        expect(screen.queryByText('Dager igjen', { exact: false })).toBeNull();
    });
});
