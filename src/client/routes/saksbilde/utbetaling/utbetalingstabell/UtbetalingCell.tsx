import styled from '@emotion/styled';
import React from 'react';

import { somPenger } from '../../../../utils/locale';

import { CellContent } from '../../table/CellContent';

const ValueContainer = styled(CellContent)`
    justify-content: flex-end;
`;

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    utbetaling?: number;
}

export const UtbetalingCell = ({ utbetaling, ...rest }: UtbetalingCellProps) => (
    <td {...rest}>{utbetaling && <ValueContainer>{somPenger(utbetaling)}</ValueContainer>}</td>
);
