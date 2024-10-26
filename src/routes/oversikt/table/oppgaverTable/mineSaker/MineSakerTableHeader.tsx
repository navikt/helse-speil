import React, { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import { Table } from '@navikt/ds-react';

import { SortKey, dateSortKey } from '@oversikt/table/state/sortation';

import { DateSelectHeader, tilDatoHeaderTekst } from '../DateSelectHeader';

export const MineSakerTableHeader = (): ReactElement => {
    const datoSelectKey = useRecoilValue(dateSortKey);
    return (
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader rowSpan={2} sortKey={SortKey.Søker} sortable>
                    Søker
                </Table.ColumnHeader>
                <Table.DataCell rowSpan={2}></Table.DataCell>
                <DateSelectHeader />
                <Table.DataCell rowSpan={2} aria-label="valg" />
                <Table.DataCell rowSpan={2} aria-label="notater" />
            </Table.Row>
            <Table.Row>
                <Table.ColumnHeader sortKey={datoSelectKey} sortable style={{ width: '140px' }}>
                    {tilDatoHeaderTekst(datoSelectKey)}
                </Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
    );
};
