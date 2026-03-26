import React, { ReactElement } from 'react';

import { getGetAntallOppgaverQueryKey, getGetOppgaverQueryKey } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiTildeling } from '@io/rest/generated/spesialist.schemas';
import { useTildel } from '@state/tildeling';
import { useQueryClient } from '@tanstack/react-query';

import { AsyncMenuButton } from './AsyncMenuButton';

interface TildelMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    personPseudoId: string;
    tildeling?: ApiTildeling | null;
}

export const TildelMenuButton = ({ personPseudoId, tildeling }: TildelMenuButtonProps): ReactElement => {
    const queryClient = useQueryClient();
    const [tildelOppgave] = useTildel();

    const tildel = async () => {
        await tildelOppgave(personPseudoId, async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() }),
                queryClient.invalidateQueries({ queryKey: getGetAntallOppgaverQueryKey() }),
            ]);
        });
    };
    return (
        <AsyncMenuButton asyncOperation={() => tildel()} disabled={!!tildeling}>
            Tildel meg
        </AsyncMenuButton>
    );
};
