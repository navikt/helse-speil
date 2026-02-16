import React, { ReactElement } from 'react';

import { Select, Table } from '@navikt/ds-react';

import { SortKey, useDateSortValue, useSetDatoSortering } from '../state/sortation';

export const DateSelectHeader = (): ReactElement => {
    const datoKey = useDateSortValue();
    const setDatoSortering = useSetDatoSortering();

    const lagreValgtFatoSortering = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setDatoSortering(event.target.value as SortKey);

    return (
        <Table.DataCell aria-label="Sorteringsdato">
            <Select
                label="Sorteringsdatovelger"
                size="small"
                hideLabel
                onChange={lagreValgtFatoSortering}
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
