import React from 'react';
import { useRecoilValue } from 'recoil';

import { Table } from '@navikt/ds-react';

import { slimOppgavetabell } from '@utils/featureToggles';

import { SortKey, dateSortKey } from '../../state/sortation';
import { HeaderCell } from '../HeaderCell';

export const PåVentSortHeaderRow = () => {
    const datoSelectKey = useRecoilValue(dateSortKey);

    return (
        <Table.Row>
            {!slimOppgavetabell && (
                <>
                    <HeaderCell text="Periodetype" />
                    <HeaderCell text="Oppgavetype" />
                    <HeaderCell text="Mottaker" />
                    <HeaderCell text="Egenskaper" />
                </>
            )}
            <Table.ColumnHeader sortKey={SortKey.Søker} sortable>
                Søker
            </Table.ColumnHeader>
            {!slimOppgavetabell && (
                <>
                    <Table.ColumnHeader sortKey={SortKey.Opprettet} sortable>
                        Opprettet
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortKey={SortKey.SøknadMottatt} sortable>
                        Søknad mottatt
                    </Table.ColumnHeader>
                </>
            )}
            {slimOppgavetabell && (
                <Table.ColumnHeader sortKey={datoSelectKey} sortable>
                    Sorter dato
                </Table.ColumnHeader>
            )}
            <Table.DataCell aria-label="valg" />
            <Table.DataCell aria-label="notater" />
            {slimOppgavetabell && <Table.DataCell aria-label="siste notat" />}
        </Table.Row>
    );
};
