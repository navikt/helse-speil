import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { DateString } from '@typer/shared';
import { getFormattedDatetimeString } from '@utils/date';

interface BehandletTimestampCellProps {
    dato: DateString;
}

export const BehandletTimestampCell = ({ dato }: BehandletTimestampCellProps): ReactElement => {
    return <Table.DataCell>{getFormattedDatetimeString(dato)}</Table.DataCell>;
};
