import React from 'react';

import { Table } from '@navikt/ds-react';

import { slimOppgavetabell } from '@utils/featureToggles';

export const IngenMatchendeFiltre = () => (
    <Table.Row>
        <Table.DataCell colSpan={slimOppgavetabell ? 4 : 8}>Ingen oppgaver matchet disse filtrene</Table.DataCell>
        <Table.DataCell colSpan={1} />
    </Table.Row>
);
