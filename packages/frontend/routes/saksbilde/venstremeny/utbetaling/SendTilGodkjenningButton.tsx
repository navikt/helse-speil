import React, { ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';
import { postUtbetalingTilTotrinnsvurdering } from '@io/http';

import { UtbetalingModal } from './UtbetalingModal';
import { AmplitudeContext } from '@io/amplitude';

interface SendTilGodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const SendTilGodkjenningButton: React.FC<SendTilGodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const amplitude = useContext(AmplitudeContext);

    const closeModal = () => setShowModal(false);

    const sendTilGodkjenning = () => {
        setIsSending(true);
        postUtbetalingTilTotrinnsvurdering(oppgavereferanse)
            .then(() => {
                amplitude.logTotrinnsoppgaveTilGodkjenning();
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
                    onApprove={sendTilGodkjenning}
                    isSending={isSending}
                    totrinnsvurdering={true}
                />
            )}
        </>
    );
};
