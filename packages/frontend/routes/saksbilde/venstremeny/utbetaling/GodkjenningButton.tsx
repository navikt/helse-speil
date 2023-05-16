// @ts-ignore
import { nanoid } from 'nanoid';
import React, { ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { Personinfo, Utbetaling } from '@io/graphql';
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
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
}

export const GodkjenningButton: React.FC<GodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    aktørId,
    erBeslutteroppgave,
    disabled = false,
    onSuccess,
    onError,
    utbetaling,
    arbeidsgiver,
    personinfo,
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
                onError?.({ ...error, message: errorMessages.get(error.message) || errorMessages.get('default') });
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
                    utbetaling={utbetaling}
                    arbeidsgiver={arbeidsgiver}
                    personinfo={personinfo}
                    onClose={closeModal}
                    onApprove={godkjennUtbetaling}
                    isSending={isSending}
                    totrinnsvurdering={false}
                />
            )}
        </>
    );
};

const errorMessages = new Map<string, string>([
    ['mangler_vurdering_av_varsler', 'Det mangler vurdering av varsler i en eller flere perioder'],
    ['ikke_aapen_saksbehandleroppgave', 'Saken er allerede utbetalt'],
    ['ikke_tilgang_til_risk_qa', 'Du har ikke tilgang til å behandle risk-saker'],
    ['default', 'Feil under fatting av vedtak'],
]);
