import React, { ReactElement } from 'react';

import { useFjernTildeling } from '@state/tildeling';

import { AsyncMenuButton } from './AsyncMenuButton';

interface MeldAvMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
}

export const MeldAvMenuButton = ({ oppgavereferanse }: MeldAvMenuButtonProps): ReactElement => {
    const [fjernTildeling] = useFjernTildeling();
    return <AsyncMenuButton asyncOperation={() => fjernTildeling(oppgavereferanse)}>Meld av</AsyncMenuButton>;
};
