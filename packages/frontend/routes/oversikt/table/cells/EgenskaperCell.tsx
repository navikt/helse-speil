import React from 'react';

import { Table } from '@navikt/ds-react';

interface EgenskaperCellProps {
    erBeslutter?: boolean;
    erRetur?: boolean;
    haster?: boolean;
    harVergemål?: boolean;
    tilhørerEnhetUtland?: boolean;
    spesialsak?: boolean;
}

const getLabel = (
    erBeslutter: boolean,
    erRetur: boolean,
    haster: boolean,
    harVergemål: boolean,
    tilhørerEnhetUtland: boolean,
    spesialsak: boolean,
) => {
    let label = '';
    if (erBeslutter) label += 'Beslutter';
    if (erRetur) label += 'Retur';
    if (haster) label += (label.length > 0 ? ', ' : '') + 'Haster';
    if (harVergemål) label += (label.length > 0 ? ', ' : '') + 'Vergemål';
    if (tilhørerEnhetUtland) label += (label.length > 0 ? ', ' : '') + 'Utland';
    if (spesialsak) label += (label.length > 0 ? ', ' : '') + '🌰';
    return label;
};

export const EgenskaperCell = ({
    erBeslutter,
    erRetur,
    haster,
    harVergemål,
    tilhørerEnhetUtland,
    spesialsak,
}: EgenskaperCellProps) => {
    const label = getLabel(
        erBeslutter ?? false,
        erRetur ?? false,
        haster ?? false,
        harVergemål ?? false,
        tilhørerEnhetUtland ?? false,
        spesialsak ?? false,
    );
    return <Table.DataCell>{label}</Table.DataCell>;
};
