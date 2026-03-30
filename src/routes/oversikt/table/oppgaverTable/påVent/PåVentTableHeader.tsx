import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { SortKey } from '@oversikt/table/state/sortation';

export function PåVentTableHeader(): ReactElement {
    return (
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader rowSpan={2} sortKey={SortKey.Søker} sortable>
                    Søker
                </Table.ColumnHeader>
                <Table.HeaderCell rowSpan={2} />
                <Table.ColumnHeader sortKey={SortKey.Tidsfrist} sortable>
                    Oppfølgingsdato
                </Table.ColumnHeader>
                <Table.DataCell rowSpan={2} aria-label="valg" />
                <Table.DataCell rowSpan={2} aria-label="notater" />
            </Table.Row>
        </Table.Header>
    );
}
