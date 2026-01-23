import React, { ReactElement } from 'react';

import { CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';

export const getFormattedFødselsnummer = (fødselsnummer: string) => {
    return fødselsnummer.slice(0, 6) + ' ' + fødselsnummer.slice(6);
};

interface FødselsnummerProps {
    fødselsnummer: string;
}

export const Fødselsnummer = ({ fødselsnummer }: FødselsnummerProps): ReactElement => (
    <HStack gap="space-4">
        <AnonymizableText>{getFormattedFødselsnummer(fødselsnummer)}</AnonymizableText>
        <Tooltip content="Kopier fødselsnummer" keys={['alt', 'c']}>
            <CopyButton copyText={fødselsnummer} size="xsmall" />
        </Tooltip>
    </HStack>
);
