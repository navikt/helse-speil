import styled from '@emotion/styled';
import React from 'react';

import { Overstyringsindikator } from '../../../../components/Overstyringsindikator';
import { somPenger } from '../../../../utils/locale';

import { CellContent } from '../../table/CellContent';

const ValueContainer = styled(CellContent)`
    justify-content: flex-end;
`;

interface UtbetalingCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    erOverstyrt?: boolean;
    utbetaling?: number;
}

export const UtbetalingCell = ({ erOverstyrt, utbetaling, style }: UtbetalingCellProps) => (
    <td style={style}>
        {utbetaling && (
            <>
                {erOverstyrt && <Overstyringsindikator />}
                <ValueContainer>{somPenger(utbetaling)}</ValueContainer>
            </>
        )}
    </td>
);
