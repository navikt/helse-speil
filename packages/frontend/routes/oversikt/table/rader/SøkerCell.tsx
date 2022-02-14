import React from 'react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { Tooltip } from '@components/Tooltip';
import { capitalizeName } from '@utils/locale';
import { Cell } from '../Cell';
import { CellContent } from './CellContent';

const getFormattedName = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    personinfo: Personinfo;
    oppgavereferanse: string;
}

export const SøkerCell = React.memo(({ personinfo, oppgavereferanse }: SøkerProps) => {
    const formatertNavn = getFormattedName(personinfo);
    const id = `søker-${oppgavereferanse}`;

    return (
        <Cell>
            <CellContent width={128} data-for={id} data-tip={formatertNavn}>
                <AnonymizableTextWithEllipsis>{formatertNavn}</AnonymizableTextWithEllipsis>
                {formatertNavn.length > 19 && <Tooltip id={id} />}
            </CellContent>
        </Cell>
    );
});
