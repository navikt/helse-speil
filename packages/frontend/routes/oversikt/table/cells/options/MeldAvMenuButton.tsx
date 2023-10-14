import React from 'react';

import { useFjernTildeling } from '@state/tildeling';

import { AsyncMenuButton } from './AsyncMenuButton';

interface MeldAvMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    aktørId: string;
}

export const MeldAvMenuButton = ({ oppgavereferanse, aktørId }: MeldAvMenuButtonProps) => {
    const [fjernTildeling] = useFjernTildeling();
    return <AsyncMenuButton asyncOperation={() => fjernTildeling(oppgavereferanse, aktørId)}>Meld av</AsyncMenuButton>;
};
