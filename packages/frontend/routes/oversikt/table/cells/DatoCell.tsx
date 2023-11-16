import React from 'react';

import { Table } from '@navikt/ds-react';

import { NORSK_DATOFORMAT, somDato } from '@utils/date';

interface DatoProps {
    date: string;
}

export const DatoCell = ({ date }: DatoProps) => (
    <Table.DataCell style={{ width: '140px' }}>{`${somDato(date).format(NORSK_DATOFORMAT)}`}</Table.DataCell>
);
