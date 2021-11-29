import React, { ReactNode, useContext, useState } from 'react';
import { Button } from '@navikt/ds-react';
import { UtbetalingModal } from './UtbetalingModal';
import { postUtbetalingsgodkjenning } from '../../../../io/http';
import { useSetRecoilState } from 'recoil';
import { opptegnelsePollingTimeState } from '../../../../state/opptegnelser';
import { AmplitudeContext } from '../../AmplitudeContext';
import { Scopes, useAddEphemeralVarsel } from '../../../../state/varsler';
import { nanoid } from 'nanoid';
import { useHistory } from 'react-router';

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
            timeToLiveMs
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

    const history = useHistory();
    const amplitude = useContext(AmplitudeContext);
    const addUtbetalingstoast = useAddUtbetalingstoast();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const closeModal = () => setShowModal(false);

    const godkjennUtbetaling = () => {
        setIsSending(true);
        postUtbetalingsgodkjenning(oppgavereferanse, aktørId)
            .then(() => {
                amplitude.logOppgaveGodkjent();
                addUtbetalingstoast();
                setIsSending(false);
                closeModal();
                onSuccess?.();
            })
            .catch((error) => {
                setIsSending(false);
                onError?.(error);
            });
    };

    return (
        <>
            <Button
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
