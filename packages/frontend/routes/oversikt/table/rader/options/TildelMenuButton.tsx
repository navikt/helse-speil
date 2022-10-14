import React from 'react';

import { Tildeling } from '@io/graphql';
import { useTildelOppgave } from '@state/oppgaver';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    saksbehandler: Omit<Tildeling, 'reservert'>;
    tildeling?: Maybe<Tildeling>;
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
            asyncOperation={() => tildelOppgave({ id: oppgavereferanse }, saksbehandler)}
            disabled={typeof tildeling !== 'object'}
            {...rest}
        >
            Tildel meg
        </AsyncMenuButton>
    );
};
