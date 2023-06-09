import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Filter } from '../../state/filter';
import styles from '../../table.module.css';
import { FilterHeader } from '../FilterHeader';

interface TilGodkjenningDropdownHeaderProps {
    filters: Filter<OppgaveForOversiktsvisning>[];
}

export const TilGodkjenningDropdownHeaderRow = ({ filters }: TilGodkjenningDropdownHeaderProps) => (
    <Table.Row className={styles.DropdownHeader}>
        <FilterHeader filters={filters} column={0} text="Tildelt" />
        <FilterHeader filters={filters} column={1} text="Periodetype" />
        <FilterHeader filters={filters} column={2} text="Oppgavetype" />
        <FilterHeader filters={filters} column={3} text="Mottaker" />
        <FilterHeader filters={filters} column={4} text="Egenskaper" />
        <FilterHeader filters={filters} column={5} text="Inntektskilde" />
    </Table.Row>
);
