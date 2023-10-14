import React from 'react';

import { Tildeling } from '@io/graphql';
import { useOpprettTildeling } from '@state/tildeling';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    aktørId: string;
    tildeling?: Maybe<Tildeling>;
}

export const TildelMenuButton: React.FC<TildelMenuButtonProps> = ({ oppgavereferanse, aktørId, tildeling }) => {
    const [tildelOppgave] = useOpprettTildeling();
    return (
        <AsyncMenuButton
            asyncOperation={() => tildelOppgave(oppgavereferanse, aktørId)}
            disabled={typeof tildeling !== 'object'}
        >
            Tildel meg
        </AsyncMenuButton>
    );
};
