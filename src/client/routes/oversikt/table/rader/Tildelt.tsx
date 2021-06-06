import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';
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
            <TekstMedEllipsis>{name}</TekstMedEllipsis>
            {name.length > 15 && <Tooltip id={id} />}
        </CellContent>
    );
};
