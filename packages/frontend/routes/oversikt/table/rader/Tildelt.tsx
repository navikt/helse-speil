import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

import { CellContent } from './CellContent';

interface TildeltProps {
    name: string;
}

export const Tildelt = ({ name }: TildeltProps) => {
    return (
        <Tooltip content={name}>
            <CellContent width={128}>
                <TextWithEllipsis>{name}</TextWithEllipsis>
            </CellContent>
        </Tooltip>
    );
};
