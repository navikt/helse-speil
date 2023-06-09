import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

interface TildeltProps {
    name: string;
    width: number;
}

export const Tildelt = ({ name, width }: TildeltProps) => {
    return (
        <Tooltip content={name}>
            <span>
                <TextWithEllipsis style={{ width: width }}>{name}</TextWithEllipsis>
            </span>
        </Tooltip>
    );
};
