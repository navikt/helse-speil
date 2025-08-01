import { nanoid } from 'nanoid';
import React, { ReactElement, ReactNode, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { Personinfo, SendTilGodkjenningV2Document, Utbetaling } from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { apolloErrorCode } from '@utils/error';

import { BackendFeil } from './Utbetaling';
import { UtbetalingModal } from './UtbetalingModal';

const useAddSendtTilGodkjenningtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Oppgaven er sendt til beslutter',
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
    arbeidsgiverIdentifikator: string;
    arbeidsgiverNavn: string;
    personinfo: Personinfo;
    vedtakBegrunnelseTekst: string;
    size: 'small' | 'medium';
}

export const SendTilGodkjenningButton = ({
    children,
    oppgavereferanse,
    disabled = false,
    onSuccess,
    utbetaling,
    arbeidsgiverIdentifikator,
    arbeidsgiverNavn,
    personinfo,
    vedtakBegrunnelseTekst,
    size,
    ...buttonProps
}: SendTilGodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const addToast = useAddSendtTilGodkjenningtoast();
    const [sendTilGodkjenningMutation, { loading, error }] = useMutation(SendTilGodkjenningV2Document);

    useKeyboard([
        {
            key: Key.F6,
            action: () => setShowModal(true),
            ignoreIfModifiers: false,
        },
    ]);

    const sendTilGodkjenning = async () => {
        await sendTilGodkjenningMutation({
            variables: {
                oppgavereferanse: oppgavereferanse,
                vedtakBegrunnelse: vedtakBegrunnelseTekst,
            },
            onCompleted: () => {
                addToast();
                onSuccess?.();
                setShowModal(false);
            },
        });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="primary"
                size={size}
                data-testid="godkjenning-button"
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                {children}
            </Button>
            {showModal && (
                <UtbetalingModal
                    showModal={showModal}
                    utbetaling={utbetaling}
                    arbeidsgiverIdentifikator={arbeidsgiverIdentifikator}
                    arbeidsgiverNavn={arbeidsgiverNavn}
                    personinfo={personinfo}
                    closeModal={() => setShowModal(false)}
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
    const errorCode = apolloErrorCode(error);

    return {
        message:
            errorCode === 409
                ? 'Denne perioden er allerede behandlet'
                : error.message === 'mangler_vurdering_av_varsler'
                  ? 'Mangler vurdering av varsler'
                  : 'Kunne ikke sende oppgaven til godkjenning',
    };
};
