import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { getFormattedDatetimeString } from '@utils/date';

const GreyBodyShort = styled(BodyShort)`
    color: var(--a-text-subtle);
    > span {
        margin: 0 8px;
    }
`;

type HendelseDateProps = {
    timestamp?: DateString;
    ident?: Maybe<string>;
};

export const HendelseDate = ({ timestamp, ident }: HendelseDateProps) => {
    return (
        <GreyBodyShort as="p" size="small">
            {timestamp && getFormattedDatetimeString(timestamp)}
            {timestamp && ident && <span>·</span>}
            {ident}
        </GreyBodyShort>
    );
};
