import React, { ReactElement } from 'react';

import { useFjernTildeling } from '@state/tildeling';

import { AsyncMenuButton } from './AsyncMenuButton';

interface MeldAvMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    erTildeltInnloggetBruker: boolean;
}

export const MeldAvMenuButton = ({
    oppgavereferanse,
    erTildeltInnloggetBruker,
}: MeldAvMenuButtonProps): ReactElement => {
    const [fjernTildeling] = useFjernTildeling();
    return (
        <AsyncMenuButton asyncOperation={() => fjernTildeling(oppgavereferanse)}>
            {erTildeltInnloggetBruker ? 'Meld av' : 'Frigi oppgave'}
        </AsyncMenuButton>
    );
};
