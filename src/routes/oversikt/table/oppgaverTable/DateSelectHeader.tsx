import React, { ReactElement } from 'react';

import { Select, Table } from '@navikt/ds-react';

import { SortKey, useDateSortState } from '../state/sortation';

import styles from './DateSelectHeader.module.css';

export const DateSelectHeader = (): ReactElement => {
    const [datoKey, setDatoKey] = useDateSortState();
    const lagreValgtDatoSortering = (key: string) => setDatoKey(key as unknown as SortKey);

    return (
        <Table.DataCell aria-label="Sorteringsdato">
            <Select
                defaultValue={datoKey}
                aria-label="Sorteringsdatovelger"
                label=""
                onChange={(e) => lagreValgtDatoSortering(e.target.value)}
                className={styles.DatoSelect}
            >
                <option value={SortKey.BehandlingOpprettetTidspunkt}>
                    {tilDatoHeaderTekst(SortKey.BehandlingOpprettetTidspunkt)}
                </option>
                <option value={SortKey.Opprettet}>{tilDatoHeaderTekst(SortKey.Opprettet)}</option>
                <option value={SortKey.SøknadMottatt}>{tilDatoHeaderTekst(SortKey.SøknadMottatt)}</option>
                <option value={SortKey.Tidsfrist}>{tilDatoHeaderTekst(SortKey.Tidsfrist)}</option>
            </Select>
        </Table.DataCell>
    );
};

export const tilDatoHeaderTekst = (key: SortKey): string => {
    switch (key) {
        case SortKey.SøknadMottatt:
            return 'Søknad mottatt';
        case SortKey.Tidsfrist:
            return 'Oppfølgingsdato';
        case SortKey.BehandlingOpprettetTidspunkt:
            return 'Startdato';
        case SortKey.Opprettet:
        default:
            return 'Oppgave klar';
    }
};
