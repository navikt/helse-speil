import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Filter } from '../../state/filter';
import styles from '../../table.module.css';
import { FilterHeader } from '../FilterHeader';

interface MineSakerDropdownHeaderProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
}

export const MineSakerDropdownHeaderRow = ({ filters }: MineSakerDropdownHeaderProps) => (
    <Table.Row className={styles.DropdownHeader}>
        <FilterHeader filters={filters} column={1} text="Periodetype" />
        <FilterHeader filters={filters} column={2} text="Oppgavetype" />
        <FilterHeader filters={filters} column={3} text="Mottaker" />
        <FilterHeader filters={filters} column={4} text="Egenskaper" />
        <FilterHeader filters={filters} column={5} text="Inntektskilde" />
        <Table.HeaderCell scope="col" colSpan={1} />
    </Table.Row>
);
