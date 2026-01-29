import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { DateString } from '@typer/shared';
import { getFormattedDatetimeString } from '@utils/date';

type HendelseDateProps = {
    timestamp?: DateString;
    ident?: string | null;
};

export const HendelseDate = ({ timestamp, ident }: HendelseDateProps): ReactElement => {
    return (
        <HStack gap="space-8">
            <BodyShort size="small">{timestamp && getFormattedDatetimeString(timestamp)}</BodyShort>
            <BodyShort size="small">{timestamp && ident && <span>·</span>}</BodyShort>
            <BodyShort size="small">{ident}</BodyShort>
        </HStack>
    );
};
