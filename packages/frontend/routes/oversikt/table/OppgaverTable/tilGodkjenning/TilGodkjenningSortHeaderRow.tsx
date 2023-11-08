import React from 'react';

import { Table } from '@navikt/ds-react';

import { SortKey } from '../../state/sortation';
import { HeaderCell } from '../HeaderCell';

export const TilGodkjenningSortHeaderRow = () => (
    <Table.Row>
        <Table.ColumnHeader sortKey={SortKey.Saksbehandler} sortable>
            Saksbehandler
        </Table.ColumnHeader>
        <HeaderCell text="Periodetype" />
        <HeaderCell text="Oppgavetype" />
        <HeaderCell text="Mottaker" />
        <HeaderCell text="Egenskaper" />
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
