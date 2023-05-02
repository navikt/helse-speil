import React from 'react';

import { OppgaveForOversiktsvisning } from '@io/graphql';

import { Header } from '../Header';
import { SortableHeader } from '../SortableHeader';
import { Sortation, opprettetSortation, saksbehandlerSortation } from '../state/sortation';
import styles from '../table.module.css';

export const SortHeaderRow = ({ sortation }: { sortation: Sortation<OppgaveForOversiktsvisning> }) => (
    <tr className={styles.SortHeader}>
        <SortableHeader
            sortation={sortation}
            sortKey={saksbehandlerSortation.sortKey}
            onSort={saksbehandlerSortation.function}
        >
            Saksbehandler
        </SortableHeader>
        <SortColumnHeader text="Periodetype" />
        <SortColumnHeader text="Oppgavetype" />
        <SortColumnHeader text="Mottaker" />
        <SortColumnHeader text="Egenskaper" />
        <SortColumnHeader text="Inntektskilde" />
        <SortableHeader sortation={sortation} sortKey={opprettetSortation.sortKey} onSort={opprettetSortation.function}>
            Opprettet
        </SortableHeader>
        <SortableHeader
            sortation={sortation}
            sortKey="søknadMottatt"
            onSort={(a, b) =>
                new Date(a.opprinneligSoknadsdato).getTime() - new Date(b.opprinneligSoknadsdato).getTime()
            }
        >
            Søknad mottatt
        </SortableHeader>
        <td aria-label="valg" />
        <td aria-label="notater" />
    </tr>
);

const SortColumnHeader = ({ text }: { text: string }) => (
    <Header scope="col" colSpan={1}>
        {text}
    </Header>
);
