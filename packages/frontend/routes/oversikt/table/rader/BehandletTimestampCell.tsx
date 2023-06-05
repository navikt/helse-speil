import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface BehandletTimestampCellProps {
    time: DateString;
}

export const BehandletTimestampCell: React.FC<BehandletTimestampCellProps> = ({ time }) => {
    const formattedTime = dayjs(time).format('HH.mm');
    return (
        <Cell>
            <CellContent width={100}>
                <BodyShort>kl. {formattedTime}</BodyShort>
            </CellContent>
        </Cell>
    );
};
