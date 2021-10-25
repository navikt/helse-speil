import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../../components/Tooltip';
import { usePersondataSkalAnonymiseres } from '../../../../state/person';

import { Cell } from '../Cell';
import { CellContent } from './CellContent';

interface BostedProps {
    stedsnavn: string;
    oppgavereferanse: string;
}

export const BostedCell = React.memo(({ stedsnavn, oppgavereferanse }: BostedProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const bosted = anonymiseringEnabled ? 'Agurkheim' : stedsnavn;
    const id = `bosted-${oppgavereferanse}`;

    return (
        <Cell>
            <CellContent width={128} data-for={id} data-tip={bosted}>
                <TekstMedEllipsis>{bosted}</TekstMedEllipsis>
                {bosted.length > 18 && <Tooltip id={id} />}
            </CellContent>
        </Cell>
    );
});
