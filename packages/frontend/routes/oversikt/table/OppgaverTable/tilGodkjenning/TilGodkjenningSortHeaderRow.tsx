import React from 'react';
import { useRecoilValue } from 'recoil';

import { Table } from '@navikt/ds-react';

import { slimOppgavetabell } from '@utils/featureToggles';

import { SortKey, dateSortKey } from '../../state/sortation';
import { HeaderCell } from '../HeaderCell';

export const TilGodkjenningSortHeaderRow = () => {
    const datoSelectKey = useRecoilValue(dateSortKey);
    return (
        <Table.Row>
            <Table.ColumnHeader sortKey={SortKey.Saksbehandler} sortable>
                Saksbehandler
            </Table.ColumnHeader>
            {!slimOppgavetabell && (
                <>
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
                </>
            )}
            {slimOppgavetabell && (
                <>
                    <HeaderCell text="" />
                    <Table.ColumnHeader sortKey={datoSelectKey} sortable style={{ width: '140px' }}>
                        {datoSelectKey === SortKey.Opprettet ? 'Opprettet' : 'Mottatt'}
                    </Table.ColumnHeader>
                </>
            )}
            <Table.DataCell aria-label="valg" />
            <Table.DataCell aria-label="notater" />
            {slimOppgavetabell && <Table.DataCell aria-label="siste notat" />}
        </Table.Row>
    );
};
