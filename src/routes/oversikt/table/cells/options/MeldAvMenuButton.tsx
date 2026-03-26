import React, { ReactElement } from 'react';

import { getGetAntallOppgaverQueryKey, getGetOppgaverQueryKey } from '@io/rest/generated/oppgaver/oppgaver';
import { useAvmeld } from '@state/tildeling';
import { useQueryClient } from '@tanstack/react-query';

import { AsyncMenuButton } from './AsyncMenuButton';

interface MeldAvMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    personPseudoId: string;
    erTildeltInnloggetBruker: boolean;
}

export const MeldAvMenuButton = ({ personPseudoId, erTildeltInnloggetBruker }: MeldAvMenuButtonProps): ReactElement => {
    const queryClient = useQueryClient();
    const [avmeldOppgave] = useAvmeld();

    const avmeld = async () => {
        await avmeldOppgave(personPseudoId, async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() }),
                queryClient.invalidateQueries({ queryKey: getGetAntallOppgaverQueryKey() }),
            ]);
        });
    };

    return (
        <AsyncMenuButton asyncOperation={() => avmeld()}>
            {erTildeltInnloggetBruker ? 'Meld av' : 'Frigi oppgave'}
        </AsyncMenuButton>
    );
};
