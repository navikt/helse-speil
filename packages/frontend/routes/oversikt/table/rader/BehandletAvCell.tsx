import React from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface BehandletAvCellProps {
    name?: Maybe<string>;
}

export const BehandletAvCell: React.FC<BehandletAvCellProps> = ({ name }) => {
    return (
        <Cell>
            {name ? (
                <Tooltip content={name}>
                    <CellContent width={128}>
                        <TextWithEllipsis>{name}</TextWithEllipsis>
                    </CellContent>
                </Tooltip>
            ) : (
                <CellContent width={128}>
                    <BodyShort>-</BodyShort>
                </CellContent>
            )}
        </Cell>
    );
};
