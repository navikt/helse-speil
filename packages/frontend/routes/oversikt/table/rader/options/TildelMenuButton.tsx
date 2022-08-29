import React from 'react';

import { useTildelOppgave } from '@state/oppgaver';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    saksbehandler: Saksbehandler;
    tildeling?: Tildeling;
}

export const TildelMenuButton: React.FC<TildelMenuButtonProps> = ({
    oppgavereferanse,
    saksbehandler,
    tildeling,
    ...rest
}) => {
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
