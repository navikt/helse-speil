import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface EgenskaperCellProps {
    erBeslutter?: boolean;
    erRetur?: boolean;
}

const getLabel = (erBeslutter: boolean, erRetur: boolean) => {
    if (erBeslutter) return 'Beslutter';
    if (erRetur) return 'Retur';
    return '';
};

export const EgenskaperCell: React.FC<EgenskaperCellProps> = ({ erBeslutter, erRetur }) => {
    const label = getLabel(erBeslutter ?? false, erRetur ?? false);
    return (
        <Cell>
            <CellContent width={130}>
                <BodyShort>{label}</BodyShort>
            </CellContent>
        </Cell>
    );
};
