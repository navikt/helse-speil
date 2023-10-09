import React from 'react';

import { Table } from '@navikt/ds-react';

import { OppgaveTilBehandling } from '@io/graphql';

import { Filter, Oppgaveoversiktkolonne } from '../../state/filter';
import { FilterHeader } from '../FilterHeader';

import styles from '../../table.module.css';

interface MineSakerDropdownHeaderProps {
    filters: Filter<OppgaveTilBehandling>[];
}

export const MineSakerDropdownHeaderRow = ({ filters }: MineSakerDropdownHeaderProps) => (
    <Table.Row className={styles.DropdownHeader}>
        <FilterHeader filters={filters} column={Oppgaveoversiktkolonne.PERIODETYPE} text="Periodetype" />
        <FilterHeader filters={filters} column={Oppgaveoversiktkolonne.OPPGAVETYPE} text="Oppgavetype" />
        <FilterHeader filters={filters} column={Oppgaveoversiktkolonne.MOTTAKER} text="Mottaker" />
        <FilterHeader filters={filters} column={Oppgaveoversiktkolonne.EGENSKAPER} text="Egenskaper" />
        <FilterHeader filters={filters} column={Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD} text="Inntektskilde" />
        <Table.HeaderCell scope="col" colSpan={1} />
    </Table.Row>
);
