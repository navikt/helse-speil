import React from 'react';

import { useFjernPåVent } from '@state/tildeling';
import { useOperationErrorHandler } from '@state/varsler';

import { AsyncMenuButton } from './AsyncMenuButton';

interface FjernFraPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    aktørId: string;
}

export const FjernFraPåVentMenuButton = ({ oppgavereferanse, aktørId, ...rest }: FjernFraPåVentMenuButtonProps) => {
    const [fjernPåVent] = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Fjern fra på vent');

    return (
        <AsyncMenuButton asyncOperation={() => fjernPåVent(oppgavereferanse, aktørId)} onFail={errorHandler} {...rest}>
            Fjern fra på vent
        </AsyncMenuButton>
    );
};
