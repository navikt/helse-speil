import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { DateString } from '@typer/shared';

interface BehandletTimestampCellProps {
    time: DateString;
}

export const BehandletTimestampCell = ({ time }: BehandletTimestampCellProps): ReactElement => {
    const formattedTime = dayjs(time).format('HH.mm');
    return <Table.DataCell>kl. {formattedTime}</Table.DataCell>;
};
