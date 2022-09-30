import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface BostedProps {
    stedsnavn: string;
}

export const BostedCell = React.memo(({ stedsnavn }: BostedProps) => {
    return (
        <Cell>
            <Tooltip content={stedsnavn}>
                <CellContent width={128}>
                    <AnonymizableTextWithEllipsis>{stedsnavn}</AnonymizableTextWithEllipsis>
                </CellContent>
            </Tooltip>
        </Cell>
    );
});
