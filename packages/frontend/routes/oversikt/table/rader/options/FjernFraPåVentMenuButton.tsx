import React from 'react';

import { useFjernPåVent } from '../../../../../state/oppgaver';
import { useOperationErrorHandler } from '../../../../../state/varsler';

import { AsyncMenuButton } from './AsyncMenuButton';

interface FjernFraPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
}

export const FjernFraPåVentMenuButton = ({ oppgavereferanse, ...rest }: FjernFraPåVentMenuButtonProps) => {
    const fjernPåVent = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    return (
        <AsyncMenuButton asyncOperation={() => fjernPåVent({ oppgavereferanse })} onFail={errorHandler} {...rest}>
            Fjern fra på vent
        </AsyncMenuButton>
    );
};
