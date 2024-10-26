import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

export const HeaderCell = ({ text }: { text?: string }): ReactElement => (
    <Table.HeaderCell scope="col" colSpan={1}>
        {text}
    </Table.HeaderCell>
);
