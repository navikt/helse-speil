import React, { ReactElement } from 'react';

import { Select, Table } from '@navikt/ds-react';

import { SortKey, useDateSortState } from '../state/sortation';

import styles from './DateSelectHeader.module.css';

export const DateSelectHeader = (): ReactElement => {
    const [datoKey, setDatoKey] = useDateSortState();

    const lagreValgtFatoSortering = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setDatoKey(event.target.value as unknown as SortKey);

    return (
        <Table.DataCell aria-label="Sorteringsdato">
            <Select
                label="Sorteringsdatovelger"
                hideLabel
                onChange={lagreValgtFatoSortering}
                className={styles.DatoSelect}
                value={datoKey}
            >
                <option value={SortKey.BehandlingOpprettetTidspunkt}>
                    {tilDatoHeaderTekst(SortKey.BehandlingOpprettetTidspunkt)}
                </option>
                <option value={SortKey.Opprettet}>{tilDatoHeaderTekst(SortKey.Opprettet)}</option>
                <option value={SortKey.Tidsfrist}>{tilDatoHeaderTekst(SortKey.Tidsfrist)}</option>
            </Select>
        </Table.DataCell>
    );
};

export const tilDatoHeaderTekst = (key: SortKey): string => {
    switch (key) {
        case SortKey.Tidsfrist:
            return 'Oppfølgingsdato';
        case SortKey.BehandlingOpprettetTidspunkt:
            return 'Startdato';
        case SortKey.Opprettet:
        default:
            return 'Oppgave klar';
    }
};
