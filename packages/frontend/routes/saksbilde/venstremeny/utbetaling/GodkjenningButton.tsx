import { nanoid } from 'nanoid';
import React, { ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { postUtbetalingsgodkjenning } from '@io/http';
import { useAddToast } from '@state/toasts';

import { UtbetalingModal } from './UtbetalingModal';

const useAddUtbetalingstoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Utbetalingen er sendt til oppdragssystemet',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
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

    useKeyboard({
        [Key.F6]: { action: () => setShowModal(true), ignoreIfModifiers: false },
    });

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
                } else if (error.statusCode === 403) {
                    onError?.({
                        ...error,
                        message:
                            'Du har ikke tilgang til å behandle denne saken. Hvis du har tildelt deg saken, meld deg av. Saken vil behandles videre av en saksbehandler med tilgang.',
                    });
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
