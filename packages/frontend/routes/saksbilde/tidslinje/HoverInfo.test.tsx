import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { enTidslinjeperiode } from 'test-data';

import { HoverInfo, tilPeriodeTekst } from './HoverInfo';
import { utbetalingstidslinje } from './useTidslinjerader.test';

const enPeriode = enTidslinjeperiode();
const wrapper: React.FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

const enArbeidsgiverperiodedag: Utbetalingsdag = {
    dato: dayjs('2020-01-01'),
    type: 'Arbeidsgiverperiode',
};

describe('HoverInfo', () => {
    test('viser antall arbeidsgiverperiodedager', () => {
        const periodeMedArbeidsgiverperiodedager = {
            ...enPeriode,
            utbetalingstidslinje: [
                ...new Array(17).fill(enArbeidsgiverperiodedag).map((dag, index) => ({
                    ...dag,
                    dato: dag.dato.add(index, 'day'),
                })),
                ...enPeriode.utbetalingstidslinje.slice(17),
            ],
        };
        render(<HoverInfo tidslinjeperiode={periodeMedArbeidsgiverperiodedager} />, { wrapper });
        expect(screen.getByText('Arbeidsgiverperiode:')).toBeVisible();
        expect(screen.getByText('01.01.2020 - 17.01.2020')).toBeVisible();
    });
    test('teller ikke med trailing helg etter oppdelt arbeidsgiverperiode', () => {
        const periodeMedArbeidsgiverperiodedager = {
            ...enPeriode,
            utbetalingstidslinje: [
                ...new Array(8).fill(enArbeidsgiverperiodedag),
                { type: 'Ferie', dato: dayjs('2020-01-01') },
                ...new Array(7).fill(enArbeidsgiverperiodedag),
                ...enPeriode.utbetalingstidslinje.slice(16),
            ],
        };
        render(<HoverInfo tidslinjeperiode={periodeMedArbeidsgiverperiodedager} />, { wrapper });
        expect(screen.getByText('Arbeidsgiverperiode:')).toBeVisible();
        expect(screen.getByText('15 dager')).toBeVisible();
    });
    test('viser antall feriedager', () => {
        const periodeMedFerie: TidslinjeperiodeMedSykefravær = {
            ...enPeriode,
            utbetalingstidslinje: [...enPeriode.utbetalingstidslinje, { dato: dayjs('2020-01-01'), type: 'Ferie' }],
        };
        render(<HoverInfo tidslinjeperiode={periodeMedFerie} />, { wrapper });
        expect(screen.getByText('Ferie:')).toBeVisible();
        expect(screen.getByText('01.01.2020')).toBeVisible();
    });
    test('viser fom og tom for perioden', () => {
        render(<HoverInfo tidslinjeperiode={enPeriode} />, { wrapper });
        expect(screen.getByText('Periode:')).toBeVisible();
        expect(screen.getByText('01.01.2021 - 31.01.2021')).toBeVisible();
    });
});

describe('Periode til visning', () => {
    test('Utbetalingstidslinje uten dagtype', () => {
        const tidslinje = utbetalingstidslinje(dayjs('2020-01-01'), dayjs('2020-01-31'), 'Ferie');
        expect(tilPeriodeTekst(tidslinje, 'Syk')).toBeUndefined();
    });

    test('Utbetalingstidslinje med ferie', () => {
        const tidslinje = utbetalingstidslinje(dayjs('2020-01-01'), dayjs('2020-01-31'), 'Ferie');
        expect(tilPeriodeTekst(tidslinje, 'Ferie')).toEqual('01.01.2020 - 31.01.2020');
    });

    test('Utbetalingstidslinje med 1 dag sykdom', () => {
        const tidslinje = utbetalingstidslinje(dayjs('2020-01-01'), dayjs('2020-01-30'), 'Ferie');
        const tidslinje2 = utbetalingstidslinje(dayjs('2020-01-31'), dayjs('2020-01-31'), 'Syk');
        const totalLinje = [...tidslinje, ...tidslinje2];
        expect(tilPeriodeTekst(totalLinje, 'Syk')).toEqual('31.01.2020');
    });

    test('Utbetalingstidslinje med ferie og sykdom', () => {
        const tidslinje = utbetalingstidslinje(dayjs('2020-01-01'), dayjs('2020-01-15'), 'Ferie');
        const tidslinje2 = utbetalingstidslinje(dayjs('2020-01-16'), dayjs('2020-01-31'), 'Syk');
        const totalLinje = [...tidslinje, ...tidslinje2];
        expect(tilPeriodeTekst(totalLinje, 'Ferie')).toEqual('01.01.2020 - 15.01.2020');
    });

    test('Utbetalingstidslinje med flere ferie-perioder', () => {
        const tidslinje = utbetalingstidslinje(dayjs('2020-01-01'), dayjs('2020-01-15'), 'Ferie');
        const tidslinje2 = utbetalingstidslinje(dayjs('2020-01-16'), dayjs('2020-01-28'), 'Syk');
        const tidslinje3 = utbetalingstidslinje(dayjs('2020-01-29'), dayjs('2020-01-31'), 'Ferie');
        const totalLinje = [...tidslinje, ...tidslinje2, ...tidslinje3];
        expect(tilPeriodeTekst(totalLinje, 'Ferie')).toEqual('18 dager');
    });
});
