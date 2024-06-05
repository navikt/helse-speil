import React from 'react';

import { Table } from '@navikt/ds-react';

export const IngenMatchendeFiltre = () => (
    <Table.Row>
        <Table.DataCell colSpan={4}>Ingen oppgaver matchet disse filtrene</Table.DataCell>
        <Table.DataCell colSpan={1} />
    </Table.Row>
);
