import React from 'react';
import { getFormattedDatetimeString } from '@utils/date';
import { BodyShort } from '@navikt/ds-react';
import styled from '@emotion/styled';

const GreyBodyShort = styled(BodyShort)`
    color: var(--navds-semantic-color-text-muted);
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
