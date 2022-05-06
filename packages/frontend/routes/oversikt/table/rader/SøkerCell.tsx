import React from 'react';

import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { capitalizeName } from '@utils/locale';
import { Cell } from '../Cell';
import { CellContent } from './CellContent';
import { Tooltip } from '@navikt/ds-react';

const getFormattedName = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`);
};

interface SøkerProps {
    personinfo: Personinfo;
}

export const SøkerCell = React.memo(({ personinfo }: SøkerProps) => {
    const formatertNavn = getFormattedName(personinfo);

    return (
        <Cell>
            <Tooltip content={formatertNavn}>
                <CellContent width={128}>
                    <AnonymizableTextWithEllipsis>{formatertNavn}</AnonymizableTextWithEllipsis>
                </CellContent>
            </Tooltip>
        </Cell>
    );
});
