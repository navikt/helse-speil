import React, { ReactNode, useContext, useState } from 'react';
import { nanoid } from 'nanoid';

import { Button } from '@navikt/ds-react';

import { UtbetalingModal } from './UtbetalingModal';
import { postUtbetalingsgodkjenning } from '@io/http';
import { Scopes, useAddEphemeralVarsel } from '@state/varsler';

import { AmplitudeContext } from '../../AmplitudeContext';

const useAddUtbetalingstoast = () => {
    const timeToLiveMs = 5000;
    const addVarsel = useAddEphemeralVarsel();

    return () => {
        addVarsel(
            {
                key: nanoid(),
                message: 'Utbetalingen er sendt til oppdragssystemet.',
                type: 'suksess',
                scope: Scopes.GLOBAL,
            },
            timeToLiveMs,
        );
    };
};

interface GodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    aktørId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const GodkjenningButton: React.FC<GodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    aktørId,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [alleredeUtbetalt, setAlleredeUtbetalt] = useState(false);

    const amplitude = useContext(AmplitudeContext);
    const addUtbetalingstoast = useAddUtbetalingstoast();

    const closeModal = () => setShowModal(false);

    const godkjennUtbetaling = () => {
        setIsSending(true);
        postUtbetalingsgodkjenning(oppgavereferanse, aktørId)
            .then(() => {
                amplitude.logOppgaveGodkjent();
                addUtbetalingstoast();
                onSuccess?.();
            })
            .catch((error) => {
                if (error.statusCode === 409) {
                    onError?.({ ...error, message: 'Saken er allerede utbetalt.' });
                    setAlleredeUtbetalt(true);
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
                disabled={alleredeUtbetalt}
                variant="primary"
                size="small"
                data-testid="godkjenning-button"
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                {children}
            </Button>
            {showModal && <UtbetalingModal onClose={closeModal} onApprove={godkjennUtbetaling} isSending={isSending} />}
        </>
    );
};
