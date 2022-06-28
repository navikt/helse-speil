import React, { ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { postUtbetalingsgodkjenning } from '@io/http';
import { AmplitudeContext } from '@io/amplitude';
import { useAddVarsel } from '@state/varsler';
import { SuccessAlert } from '@utils/error';

import { UtbetalingModal } from './UtbetalingModal';

const useAddUtbetalingstoast = () => {
    const timeToLiveMS = 5000;
    const addVarsel = useAddVarsel();

    return () => {
        addVarsel(new SuccessAlert('Utbetalingen er sendt til oppdragssystemet.', { timeToLiveMS, scope: '/' }));
    };
};

interface GodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    aktørId: string;
    erBeslutteroppgave: boolean;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const GodkjenningButton: React.FC<GodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    aktørId,
    erBeslutteroppgave,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const amplitude = useContext(AmplitudeContext);
    const addUtbetalingstoast = useAddUtbetalingstoast();

    const closeModal = () => setShowModal(false);

    const godkjennUtbetaling = () => {
        setIsSending(true);
        postUtbetalingsgodkjenning(oppgavereferanse, aktørId)
            .then(() => {
                amplitude.logOppgaveGodkjent(erBeslutteroppgave);
                addUtbetalingstoast();
                onSuccess?.();
            })
            .catch((error) => {
                if (error.statusCode === 409) {
                    onError?.({ ...error, message: 'Saken er allerede utbetalt.' });
                } else onError?.(error);
            })
            .finally(() => {
                setIsSending(false);
                closeModal();
            });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="primary"
                size="small"
                data-testid="godkjenning-button"
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                {children}
            </Button>
            {showModal && (
                <UtbetalingModal
                    onClose={closeModal}
                    onApprove={godkjennUtbetaling}
                    isSending={isSending}
                    totrinnsvurdering={false}
                />
            )}
        </>
    );
};
