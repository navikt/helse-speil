import React from 'react';
import dayjs from 'dayjs';
import { BodyShort } from '@navikt/ds-react';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface FerdigstiltCellProps {
    time: DateString;
}

export const FerdigstiltCell: React.FC<FerdigstiltCellProps> = ({ time }) => {
    const formattedTime = dayjs(time).format('HH:mm');
    return (
        <Cell>
            <CellContent width={100}>
                <BodyShort>kl. {formattedTime}</BodyShort>
            </CellContent>
        </Cell>
    );
};
