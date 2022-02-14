import React from 'react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Tooltip } from '@components/Tooltip';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface BostedProps {
    stedsnavn: string;
    oppgavereferanse: string;
}

export const BostedCell = React.memo(({ stedsnavn, oppgavereferanse }: BostedProps) => {
    const id = `bosted-${oppgavereferanse}`;

    return (
        <Cell>
            <CellContent width={128} data-for={id} data-tip={stedsnavn}>
                <AnonymizableTextWithEllipsis>{stedsnavn}</AnonymizableTextWithEllipsis>
                {stedsnavn.length > 18 && <Tooltip id={id} />}
            </CellContent>
        </Cell>
    );
});
