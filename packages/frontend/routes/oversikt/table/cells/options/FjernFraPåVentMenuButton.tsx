import React from 'react';

import { useFjernPåVent } from '@state/tildeling';
import { useOperationErrorHandler } from '@state/varsler';

import { AsyncMenuButton } from './AsyncMenuButton';

interface FjernFraPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
}

export const FjernFraPåVentMenuButton = ({ oppgavereferanse }: FjernFraPåVentMenuButtonProps) => {
    const [fjernPåVent] = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Fjern fra på vent');

    return (
        <AsyncMenuButton asyncOperation={() => fjernPåVent(oppgavereferanse)} onFail={errorHandler}>
            Fjern fra på vent
        </AsyncMenuButton>
    );
};
