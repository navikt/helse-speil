import React, { ReactElement } from 'react';

import { Tildeling } from '@io/graphql';
import { useOpprettTildeling } from '@state/tildeling';
import { Maybe } from '@utils/ts';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    tildeling?: Maybe<Tildeling>;
}

export const TildelMenuButton = ({ oppgavereferanse, tildeling }: TildelMenuButtonProps): ReactElement => {
    const [tildelOppgave] = useOpprettTildeling();
    return (
        <AsyncMenuButton
            asyncOperation={() => tildelOppgave(oppgavereferanse)}
            disabled={typeof tildeling !== 'object'}
        >
            Tildel meg
        </AsyncMenuButton>
    );
};
