import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { TextWithEllipsis } from '@components/TextWithEllipsis';

interface TildeltProps {
    name: string;
}

export const Tildelt = ({ name }: TildeltProps) => {
    return (
        <Tooltip content={name}>
            <span>
                <TextWithEllipsis style={{ width: 128 }}>{name}</TextWithEllipsis>
            </span>
        </Tooltip>
    );
};
