import React from 'react';

import { Table } from '@navikt/ds-react';

import { SortKey } from '../../state/sortation';
import { HeaderCell } from '../HeaderCell';

export const PåVentSortHeaderRow = () => (
    <Table.Row>
        <HeaderCell text="Periodetype" />
        <HeaderCell text="Oppgavetype" />
        <HeaderCell text="Mottaker" />
        <HeaderCell text="Egenskaper" />
        <HeaderCell text="Inntektskilde" />
        <Table.ColumnHeader sortKey={SortKey.Søker} sortable>
            Søker
        </Table.ColumnHeader>
        <Table.ColumnHeader sortKey={SortKey.Opprettet} sortable>
            Opprettet
        </Table.ColumnHeader>
        <Table.ColumnHeader sortKey={SortKey.SøknadMottatt} sortable>
            Søknad mottatt
        </Table.ColumnHeader>
        <Table.DataCell aria-label="valg" />
        <Table.DataCell aria-label="notater" />
    </Table.Row>
);
