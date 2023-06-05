import { nanoid } from 'nanoid';
import React, { ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { Personinfo, Utbetaling } from '@io/graphql';
import { postUtbetalingTilTotrinnsvurdering } from '@io/http';
import { useAddToast } from '@state/toasts';

import { BackendFeil } from './Utbetaling';
import { UtbetalingModal } from './UtbetalingModal';

const useAddSendtTilGodkjenningtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt til beslutter',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
    };
};

interface SendTilGodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    disabled: boolean;
    onSuccess?: () => void;
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
}

export const SendTilGodkjenningButton: React.FC<SendTilGodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    disabled = false,
    onSuccess,
    utbetaling,
    arbeidsgiver,
    personinfo,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<BackendFeil | undefined>();
    const amplitude = useContext(AmplitudeContext);
    const addToast = useAddSendtTilGodkjenningtoast();

    useKeyboard({
        [Key.F6]: {
            action: () => setShowModal(true),
            ignoreIfModifiers: false,
        },
    });

    const closeModal = () => {
        setError(undefined);
        setShowModal(false);
    };

    const sendTilGodkjenning = () => {
        setIsSending(true);
        postUtbetalingTilTotrinnsvurdering(oppgavereferanse)
            .then(() => {
                amplitude.logTotrinnsoppgaveTilGodkjenning();
                addToast();
                onSuccess?.();
                closeModal();
            })
            .catch((error) => {
                if (error.statusCode === 409) {
                    setError({ ...error, message: 'Denne perioden er allerede behandlet' });
                } else setError(error);
            })
            .finally(() => {
                setIsSending(false);
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
                    utbetaling={utbetaling}
                    arbeidsgiver={arbeidsgiver}
                    personinfo={personinfo}
                    onClose={closeModal}
                    onApprove={sendTilGodkjenning}
                    error={error}
                    isSending={isSending}
                    totrinnsvurdering={true}
                />
            )}
        </>
    );
};
