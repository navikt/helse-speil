import dayjs from 'dayjs';
import React from 'react';

import { Table } from '@navikt/ds-react';

interface BehandletTimestampCellProps {
    time: DateString;
}

export const BehandletTimestampCell = ({ time }: BehandletTimestampCellProps) => {
    const formattedTime = dayjs(time).format('HH.mm');
    return <Table.DataCell>kl. {formattedTime}</Table.DataCell>;
};
