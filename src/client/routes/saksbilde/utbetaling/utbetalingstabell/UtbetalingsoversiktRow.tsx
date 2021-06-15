import { Overstyring, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { Row } from '../../table/Row';
import { DateCell } from './DateCell';
import { GjenståendeDagerCell } from './GjenståendeDagerCell';
import { GradCell } from './GradCell';
import { KildeCell } from './KildeCell';
import { MerknaderCell } from './MerknaderCell';
import { TotalGradCell } from './TotalGradCell';
import { UtbetalingCell } from './UtbetalingCell';
import { UtbetalingsdagCell } from './UtbetalingsdagCell';

interface UtbetalingsoversiktRowProps {
    utbetalingsdag: Utbetalingsdag;
    sykdomsdag: Sykdomsdag;
    isMaksdato: boolean;
    gjenståendeDager?: number;
    overstyring?: Overstyring;
}

export const UtbetalingsoversiktRow = ({
    utbetalingsdag,
    sykdomsdag,
    isMaksdato,
    gjenståendeDager,
    overstyring,
}: UtbetalingsoversiktRowProps) => (
    <Row type={utbetalingsdag.type}>
        <DateCell date={utbetalingsdag.dato} />
        <UtbetalingsdagCell typeUtbetalingsdag={utbetalingsdag.type} typeSykdomsdag={sykdomsdag.type} />
        <GradCell type={utbetalingsdag.type} grad={utbetalingsdag.gradering} />
        <KildeCell type={sykdomsdag.type} kilde={sykdomsdag.kilde} overstyring={overstyring} />
        <TotalGradCell type={utbetalingsdag.type} totalGradering={utbetalingsdag.totalGradering} />
        <UtbetalingCell utbetaling={utbetalingsdag.utbetaling} />
        <GjenståendeDagerCell gjenståendeDager={gjenståendeDager} />
        <MerknaderCell style={{ width: '100%' }} dag={utbetalingsdag} isMaksdato={isMaksdato} />
    </Row>
);
