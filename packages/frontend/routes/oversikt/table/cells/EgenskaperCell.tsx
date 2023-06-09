import React from 'react';

import { Table } from '@navikt/ds-react';

interface EgenskaperCellProps {
    erBeslutter?: boolean;
    erRetur?: boolean;
}

const getLabel = (erBeslutter: boolean, erRetur: boolean) => {
    if (erBeslutter) return 'Beslutter';
    if (erRetur) return 'Retur';
    return '';
};

export const EgenskaperCell = ({ erBeslutter, erRetur }: EgenskaperCellProps) => {
    const label = getLabel(erBeslutter ?? false, erRetur ?? false);
    return <Table.DataCell>{label}</Table.DataCell>;
};
