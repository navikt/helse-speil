import React from 'react';
import { Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

import { CellContent } from './CellContent';
import { Cell } from '../Cell';

interface BehandletAvCellProps {
    name: string;
}

export const BehandletAvCell: React.FC<BehandletAvCellProps> = ({ name }) => {
    return (
        <Cell>
            <Tooltip content={name}>
                <CellContent width={128}>
                    <TextWithEllipsis>{name}</TextWithEllipsis>
                </CellContent>
            </Tooltip>
        </Cell>
    );
};
