import React, { ReactElement } from 'react';

import { BodyShort, Tooltip } from '@navikt/ds-react';

interface TildeltProps {
    name: string;
    width: number;
}

export const Tildelt = ({ name, width }: TildeltProps): ReactElement => {
    return (
        <Tooltip content={name} describesChild>
            <BodyShort truncate data-sensitive style={{ width: width }}>
                {name}
            </BodyShort>
        </Tooltip>
    );
};
