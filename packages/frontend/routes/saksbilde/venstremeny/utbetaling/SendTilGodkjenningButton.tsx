import React, { ReactNode, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { UtbetalingModal } from './UtbetalingModal';
import { postUtbetalingTilTotrinnsvurdering } from '@io/http';

interface SendTilGodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    aktørId: string;
    fødselsnummer: string;
    saksbehandlerIdent: string;
    vedtaksperiodeId: string;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const SendTilGodkjenningButton: React.FC<SendTilGodkjenningButtonProps> = ({
    children,
    aktørId,
    fødselsnummer,
    saksbehandlerIdent,
    vedtaksperiodeId,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const closeModal = () => setShowModal(false);

    const sendTilGodkjenning = () => {
        setIsSending(true);
        postUtbetalingTilTotrinnsvurdering(aktørId, fødselsnummer, saksbehandlerIdent, vedtaksperiodeId)
            .then(() => {
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
