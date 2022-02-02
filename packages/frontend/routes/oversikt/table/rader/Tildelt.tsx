import React from 'react';

import { TextWithEllipsis } from '../../../../components/TextWithEllipsis';
import { Tooltip } from '../../../../components/Tooltip';

import { CellContent } from './CellContent';

interface TildeltProps {
    name: string;
    oppgavereferanse: string;
}

export const Tildelt = ({ name, oppgavereferanse }: TildeltProps) => {
    const id = `tildelt-${oppgavereferanse}`;

    return (
        <CellContent width={128} data-tip={name} data-for={id}>
            <TextWithEllipsis>{name}</TextWithEllipsis>
            {name.length > 15 && <Tooltip id={id} />}
        </CellContent>
    );
};
