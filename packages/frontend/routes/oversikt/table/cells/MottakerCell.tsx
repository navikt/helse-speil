import React from 'react';

import { Table } from '@navikt/ds-react';

import { Mottaker } from '@io/graphql';
import { capitalize } from '@utils/locale';

interface MottakerCellProps {
    mottaker?: Maybe<Mottaker>;
}

export const MottakerCell = ({ mottaker }: MottakerCellProps) => {
    return <Table.DataCell>{capitalize(mottaker ?? '')}</Table.DataCell>;
};
