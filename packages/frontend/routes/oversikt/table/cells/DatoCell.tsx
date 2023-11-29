import React from 'react';

import { Table } from '@navikt/ds-react';

import { NORSK_DATOFORMAT, somDato } from '@utils/date';

interface DatoProps {
    date: Maybe<string>;
}

export const DatoCell = ({ date }: DatoProps) => (
    <Table.DataCell style={{ width: '140px' }}>{date && `${somDato(date).format(NORSK_DATOFORMAT)}`}</Table.DataCell>
);
