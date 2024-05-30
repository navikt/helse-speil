import React from 'react';

import { Table } from '@navikt/ds-react';

export const HeaderCell = ({ text }: { text: string }) => (
    <Table.HeaderCell scope="col" colSpan={1}>
        {text}
    </Table.HeaderCell>
);
