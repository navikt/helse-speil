import React, { ReactElement } from 'react';

import { Tildeling } from '@io/rest/generated/spesialist.schemas';
import { useOpprettTildeling } from '@state/tildeling';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    tildeling?: Tildeling | null;
}

export const TildelMenuButton = ({ oppgavereferanse, tildeling }: TildelMenuButtonProps): ReactElement => {
    const [tildelOppgave] = useOpprettTildeling();
    return (
        <AsyncMenuButton asyncOperation={() => tildelOppgave(oppgavereferanse)} disabled={!!tildeling}>
            Tildel meg
        </AsyncMenuButton>
    );
};
