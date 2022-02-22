import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Utbetalingstabell } from './Utbetalingstabell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const enUtbetalingstabelldag = (overrides?: Partial<UtbetalingstabellDag>): UtbetalingstabellDag => ({
    dato: overrides?.dato ?? dayjs(),
    type: overrides?.type ?? 'Syk',
    gradering: overrides?.gradering ?? 100,
    totalGradering: overrides?.totalGradering ?? 100,
    utbetaling: overrides?.utbetaling ?? 1234,
    dagerIgjen: overrides?.dagerIgjen ?? 100,
    overstyringer: overrides?.overstyringer,
    isMaksdato: false,
    sykdomsdag: overrides?.sykdomsdag ?? {
        type: 'Syk',
        kilde: 'Sykmelding',
        grad: undefined,
    },
});

const dager: [string, UtbetalingstabellDag][] = new Array(10)
    .fill(dayjs())
    .map((it: Dayjs, i: number) => it.add(i, 'days'))
    .map((it) => [it.format(NORSK_DATOFORMAT), enUtbetalingstabelldag({ dato: it })]);

describe('Utbetalingstabell', () => {
    it('rendrer headere, totalrad og dagrader', () => {
        const dagerMap = new Map<string, UtbetalingstabellDag>(dager);
        render(<Utbetalingstabell fom={dayjs('2021-01-01')} tom={dayjs('2021-01-10')} dager={dagerMap} />);

        expect(screen.getAllByRole('row')).toHaveLength(12);
    });
});
