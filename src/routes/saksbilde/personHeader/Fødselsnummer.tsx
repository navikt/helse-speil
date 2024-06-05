import React from 'react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';

const getFormattedFødselsnummer = (fødselsnummer: string) => {
    return fødselsnummer.slice(0, 6) + ' ' + fødselsnummer.slice(6);
};

interface FødselsnummerProps {
    fødselsnummer: string;
}

export const Fødselsnummer: React.FC<FødselsnummerProps> = ({ fødselsnummer }) => {
    return (
        <Clipboard
            preserveWhitespace={false}
            copyMessage="Fødselsnummer er kopiert"
            tooltip={{ content: 'Kopier fødselsnummer', keys: ['alt', 'c'] }}
        >
            <AnonymizableText>{getFormattedFødselsnummer(fødselsnummer)}</AnonymizableText>
        </Clipboard>
    );
};
