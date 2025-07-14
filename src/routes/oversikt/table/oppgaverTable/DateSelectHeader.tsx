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
                <option value={SortKey.Opprettet}>{tilDatoKeyTekst(SortKey.Opprettet)}</option>
                <option value={SortKey.SøknadMottatt}>{tilDatoKeyTekst(SortKey.SøknadMottatt)}</option>
                <option value={SortKey.Tidsfrist}>{tilDatoKeyTekst(SortKey.Tidsfrist)}</option>
            </Select>
        </Table.DataCell>
    );
};

const tilDatoKeyTekst = (key: string): string => {
    switch (key) {
        case 'søknadMottatt':
            return 'Søknad mottatt';
        case 'tidsfrist':
            return 'Oppfølgingsdato';
        case 'opprettet':
        default:
            return 'Opprettet dato';
    }
};
export const tilDatoHeaderTekst = (key: SortKey): string => {
    switch (key) {
        case SortKey.SøknadMottatt:
            return 'Mottatt';
        case SortKey.Tidsfrist:
            return 'Oppfølgingsdato';
        case SortKey.Opprettet:
        default:
            return 'Opprettet';
    }
};
