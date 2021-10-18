import React from 'react';

import { Bold } from '../../../components/Bold';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { Cell } from './Cell';

interface FraCellProps {
    utbetaling: UtbetalingshistorikkUtbetaling;
}

export const FraCell: React.FC<FraCellProps> = ({ utbetaling }) => (
    <Cell>
        <Bold>{utbetaling.arbeidsgiverOppdrag.utbetalingslinjer[0].fom.format(NORSK_DATOFORMAT_KORT)}</Bold>
    </Cell>
);
