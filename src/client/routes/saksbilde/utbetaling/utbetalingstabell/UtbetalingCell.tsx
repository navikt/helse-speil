import styled from '@emotion/styled';
import React from 'react';

import { Endringstrekant } from '../../../../components/Endringstrekant';
import { somPenger } from '../../../../utils/locale';

import { CellContent } from '../../table/CellContent';
import { Cell } from './Cell';

const ValueContainer = styled(CellContent)`
    justify-content: flex-end;
`;

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    erOverstyrt?: boolean;
    utbetaling?: number;
}

export const UtbetalingCell = ({ erOverstyrt, utbetaling, style }: UtbetalingCellProps) => (
    <Cell erOverstyrt={erOverstyrt} style={style}>
        {erOverstyrt && <Endringstrekant />}
        <ValueContainer>{utbetaling ? somPenger(utbetaling) : '-'}</ValueContainer>
    </Cell>
);
