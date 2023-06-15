import React from 'react';

import { Table } from '@navikt/ds-react';

interface EgenskaperCellProps {
    erBeslutter?: boolean;
    erRetur?: boolean;
    haster?: boolean;
}

const getLabel = (erBeslutter: boolean, erRetur: boolean, haster: boolean) => {
    let label = '';
    if (erBeslutter) label += 'Beslutter';
    if (erRetur) label += 'Retur';
    if (haster) label += (label.length > 0 ? ', ' : '') + 'Haster';
    return label;
};

export const EgenskaperCell = ({ erBeslutter, erRetur, haster }: EgenskaperCellProps) => {
    const label = getLabel(erBeslutter ?? false, erRetur ?? false, haster ?? false);
    return <Table.DataCell>{label}</Table.DataCell>;
};
