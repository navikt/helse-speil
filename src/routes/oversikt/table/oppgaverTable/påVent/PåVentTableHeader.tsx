import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { SortKey, useDateSortValue } from '@oversikt/table/state/sortation';

import { DateSelectHeader, tilDatoHeaderTekst } from '../DateSelectHeader';

export const PåVentTableHeader = (): ReactElement => {
    const datoSelectKey = useDateSortValue();
    return (
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader rowSpan={2} sortKey={SortKey.Søker} sortable>
                    Søker
                </Table.ColumnHeader>
                <Table.HeaderCell rowSpan={2} />
                <DateSelectHeader />
                <Table.DataCell rowSpan={2} aria-label="valg" />
                <Table.DataCell rowSpan={2} aria-label="notater" />
            </Table.Row>
            <Table.Row>
                <Table.ColumnHeader sortKey={datoSelectKey} sortable>
                    {tilDatoHeaderTekst(datoSelectKey)}
                </Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
    );
};
