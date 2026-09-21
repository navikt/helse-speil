import React, { ReactElement } from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

export const getFormattedFødselsnummer = (fødselsnummer: string) => {
    return fødselsnummer.slice(0, 6) + ' ' + fødselsnummer.slice(6);
};

interface FødselsnummerProps {
    fødselsnummer: string;
}

export const Fødselsnummer = ({ fødselsnummer }: FødselsnummerProps): ReactElement => (
    <HStack gap="space-4">
        <BodyShort data-sensitive>{getFormattedFødselsnummer(fødselsnummer)}</BodyShort>
        <Tooltip content="Kopier fødselsnummer" keys={['alt', 'c']}>
            <CopyButton copyText={fødselsnummer} size="xsmall" />
        </Tooltip>
    </HStack>
);
