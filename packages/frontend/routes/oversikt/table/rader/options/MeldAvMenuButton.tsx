import React from 'react';

import { useFjernTildeling } from '@state/oppgaver';

import { AsyncMenuButton } from './AsyncMenuButton';

interface MeldAvMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
}

export const MeldAvMenuButton = ({ oppgavereferanse, ...rest }: MeldAvMenuButtonProps) => {
    const fjernTildeling = useFjernTildeling();
    return (
        <AsyncMenuButton asyncOperation={fjernTildeling(oppgavereferanse)} {...rest}>
            Meld av
        </AsyncMenuButton>
    );
};
