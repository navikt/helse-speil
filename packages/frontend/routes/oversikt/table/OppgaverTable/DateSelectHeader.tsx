import React from 'react';
import { useRecoilState } from 'recoil';

import { Select, Table } from '@navikt/ds-react';

import { fellesPåVentBenk } from '@utils/featureToggles';

import { SortKey, dateSortKey } from '../state/sortation';

import styles from './DateSelectHeader.module.css';

export const DateSelectHeader = () => {
    const [datoKey, setDatoKey] = useRecoilState(dateSortKey);
    const lagreValgtDatoSortering = (key: string) => setDatoKey(key as unknown as SortKey);

    return (
        <Table.Row className={styles.datoselect}>
            <Table.DataCell />
            <Table.DataCell />
            <Table.DataCell aria-label="Sorteringsdato" className={styles.selecttd}>
                <Select
                    defaultValue={datoKey}
                    aria-label="Sorteringsdatovelger"
                    label=""
                    onChange={(e) => lagreValgtDatoSortering(e.target.value)}
                    className={styles.select}
                >
                    <option value={SortKey.Opprettet}>{tilDatoKeyTekst(SortKey.Opprettet)}</option>
                    <option value={SortKey.SøknadMottatt}>{tilDatoKeyTekst(SortKey.SøknadMottatt)}</option>
                    {fellesPåVentBenk && (
                        <option value={SortKey.Tidsfrist}>{tilDatoKeyTekst(SortKey.Tidsfrist)}</option>
                    )}
                </Select>
            </Table.DataCell>
        </Table.Row>
    );
};

const tilDatoKeyTekst = (key: string) => {
    switch (key) {
        case 'søknadMottatt':
            return 'Søknad mottatt';
        case 'tidsfrist':
            return 'Tidsfrist';
        case 'opprettet':
        default:
            return 'Opprettet dato';
    }
};
export const tilDatoHeaderTekst = (key: SortKey) => {
    switch (key) {
        case SortKey.SøknadMottatt:
            return 'Mottatt';
        case SortKey.Tidsfrist:
            return 'Tidsfrist';
        case SortKey.Opprettet:
        default:
            return 'Opprettet';
    }
};
