import dayjs from 'dayjs';
import React from 'react';

import { Table } from '@navikt/ds-react';

import { DateString } from '@/types/shared';

interface BehandletTimestampCellProps {
    time: DateString;
}

export const BehandletTimestampCell = ({ time }: BehandletTimestampCellProps) => {
    const formattedTime = dayjs(time).format('HH.mm');
    return <Table.DataCell>kl. {formattedTime}</Table.DataCell>;
};
