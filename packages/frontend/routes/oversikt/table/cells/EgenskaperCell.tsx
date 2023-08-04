import React from 'react';

import { Table } from '@navikt/ds-react';

interface EgenskaperCellProps {
    erBeslutter?: boolean;
    erRetur?: boolean;
    haster?: boolean;
    harVergemål?: boolean;
}

const getLabel = (erBeslutter: boolean, erRetur: boolean, haster: boolean, harVergemål: boolean) => {
    let label = '';
    if (erBeslutter) label += 'Beslutter';
    if (erRetur) label += 'Retur';
    if (haster) label += (label.length > 0 ? ', ' : '') + 'Haster';
    if (harVergemål) label += (label.length > 0 ? ', ' : '') + 'Vergemål';
    return label;
};

export const EgenskaperCell = ({ erBeslutter, erRetur, haster, harVergemål }: EgenskaperCellProps) => {
    const label = getLabel(erBeslutter ?? false, erRetur ?? false, haster ?? false, harVergemål ?? false);
    return <Table.DataCell>{label}</Table.DataCell>;
};
