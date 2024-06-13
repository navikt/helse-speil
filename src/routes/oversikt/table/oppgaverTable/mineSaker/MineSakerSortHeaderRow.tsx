import React, { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import { Table } from '@navikt/ds-react';

import { SortKey, dateSortKey } from '@oversikt/table/state/sortation';

import { tilDatoHeaderTekst } from '../DateSelectHeader';
import { HeaderCell } from '../HeaderCell';

export const MineSakerSortHeaderRow = (): ReactElement => {
    const datoSelectKey = useRecoilValue(dateSortKey);
    return (
        <Table.Row>
            <Table.ColumnHeader sortKey={SortKey.Søker} sortable>
                Søker
            </Table.ColumnHeader>
            <HeaderCell text="" />
            <Table.ColumnHeader sortKey={datoSelectKey} sortable style={{ width: '140px' }}>
                {tilDatoHeaderTekst(datoSelectKey)}
            </Table.ColumnHeader>
            <Table.DataCell aria-label="valg" />
            <Table.DataCell aria-label="notater" />
        </Table.Row>
    );
};
