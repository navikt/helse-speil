import React, { ReactElement } from 'react';
import { useRecoilValue } from 'recoil';

import { Table } from '@navikt/ds-react';

import { SortKey, dateSortKey } from '@oversikt/table/state/sortation';

import { DateSelectHeader, tilDatoHeaderTekst } from '../DateSelectHeader';

export const TilGodkjenningHeaderRows = (): ReactElement => {
    const datoSelectKey = useRecoilValue(dateSortKey);
    return (
        <>
            <Table.Row>
                <Table.ColumnHeader sortKey={SortKey.Saksbehandler} sortable rowSpan={2}>
                    Saksbehandler
                </Table.ColumnHeader>
                <Table.DataCell rowSpan={2} />
                <DateSelectHeader />
                <Table.DataCell rowSpan={2} aria-label="valg" />
                <Table.DataCell rowSpan={2} aria-label="notater" />
            </Table.Row>
            <Table.Row>
                <Table.ColumnHeader sortKey={datoSelectKey} sortable>
                    {tilDatoHeaderTekst(datoSelectKey)}
                </Table.ColumnHeader>
            </Table.Row>
        </>
    );
};
