import React from 'react';

import { useTildelOppgave } from '@state/oppgaver';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    saksbehandler: Saksbehandler;
    tildeling?: Tildeling;
}

export const TildelMenuButton = ({ oppgavereferanse, saksbehandler, tildeling, ...rest }: TildelMenuButtonProps) => {
    const tildelOppgave = useTildelOppgave();
    return (
        <AsyncMenuButton
            asyncOperation={() => tildelOppgave({ oppgavereferanse }, saksbehandler)}
            disabled={tildeling !== undefined}
            {...rest}
        >
            Tildel meg
        </AsyncMenuButton>
    );
};
