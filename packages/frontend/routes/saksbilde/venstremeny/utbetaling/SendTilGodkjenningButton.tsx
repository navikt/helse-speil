import { nanoid } from 'nanoid';
import React, { ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { Personinfo, SendTilGodkjenningDocument, Utbetaling } from '@io/graphql';
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
    const amplitude = useContext(AmplitudeContext);
    const addToast = useAddSendtTilGodkjenningtoast();
    const [sendTilGodkjenningMutation, { loading, error }] = useMutation(SendTilGodkjenningDocument);

    useKeyboard([
        {
            key: Key.F6,
            action: () => setShowModal(true),
            ignoreIfModifiers: false,
        },
    ]);

    const closeModal = () => {
        setShowModal(false);
    };

    const sendTilGodkjenning = async () => {
        await sendTilGodkjenningMutation({
            variables: { oppgavereferanse },
            onCompleted: () => {
                amplitude.logTotrinnsoppgaveTilGodkjenning();
                addToast();
                onSuccess?.();
                closeModal();
            },
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
                    error={error && somBackendfeil(error)}
                    isSending={loading}
                    totrinnsvurdering={true}
                />
            )}
        </>
    );
};

const somBackendfeil = (error: ApolloError): BackendFeil => {
    const errorCode = (error.graphQLErrors[0].extensions['code'] as { value: number }).value;

    return {
        message: errorCode === 409 ? 'Denne perioden er allerede behandlet' : error.message,
        statusCode: errorCode,
    };
};
