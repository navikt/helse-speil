import { Dayjs } from 'dayjs';
import { Periode, Sykdomsdag, Utbetalingsdag, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { Flex } from '../../../components/Flex';

import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';

export interface UtbetalingProps {
    gjenståendeDager?: number;
    maksdato?: Dayjs;
    periode: Periode;
    utbetalingstidslinje: Utbetalingsdag[];
    sykdomstidslinje: Sykdomsdag[];
    vedtaksperiode: Vedtaksperiode;
}

export const Utbetaling = ({
    gjenståendeDager,
    maksdato,
    periode,
    utbetalingstidslinje,
    sykdomstidslinje,
    vedtaksperiode,
}: UtbetalingProps) => (
    <AgurkErrorBoundary sidenavn="Utbetaling">
        <Flex style={{ height: '100%' }}>
            <Utbetalingstabell
                maksdato={maksdato}
                gjenståendeDager={gjenståendeDager}
                periode={periode}
                utbetalingstidslinje={utbetalingstidslinje}
                sykdomstidslinje={sykdomstidslinje}
                overstyringer={vedtaksperiode.overstyringer}
            />
        </Flex>
    </AgurkErrorBoundary>
);
