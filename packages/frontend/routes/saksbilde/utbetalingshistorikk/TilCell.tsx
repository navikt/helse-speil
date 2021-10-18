import React from 'react';

import { Bold } from '../../../components/Bold';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { Cell } from './Cell';

interface TilCellProps {
    utbetaling: UtbetalingshistorikkUtbetaling;
}

export const TilCell: React.FC<TilCellProps> = ({ utbetaling }) => (
    <Cell>
        <Bold>{utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.slice(-1)[0].tom.format(NORSK_DATOFORMAT_KORT)}</Bold>
    </Cell>
);
