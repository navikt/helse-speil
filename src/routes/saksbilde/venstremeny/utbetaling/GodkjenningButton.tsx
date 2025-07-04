import { nanoid } from 'nanoid';
import React, { ReactElement, ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { FattVedtakDocument, Personinfo, Utbetaling } from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { apolloExtensionValue } from '@utils/error';

import { BackendFeil } from './Utbetaling';
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
    erBeslutteroppgave: boolean;
    disabled: boolean;
    onSuccess?: () => void;
    utbetaling: Utbetaling;
    arbeidsgiverIdentifikator: string;
    arbeidsgiverNavn: string;
    personinfo: Personinfo;
    vedtakBegrunnelseTekst: string;
    size: 'small' | 'medium';
}

export const GodkjenningButton = ({
    children,
    oppgavereferanse,
    erBeslutteroppgave,
    disabled = false,
    onSuccess,
    utbetaling,
    arbeidsgiverIdentifikator,
    arbeidsgiverNavn,
    personinfo,
    vedtakBegrunnelseTekst,
    size,
    ...buttonProps
}: GodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const [fattVedtakMutation, { error, loading, reset: resetFattVedtakMutation }] = useMutation(FattVedtakDocument);
    useKeyboard([{ key: Key.F6, action: () => !disabled && setShowModal(true), ignoreIfModifiers: false }]);

    const amplitude = useContext(AmplitudeContext);
    const addUtbetalingstoast = useAddUtbetalingstoast();

    const godkjennUtbetaling = () => {
        void fattVedtakMutation({
            variables: {
                oppgavereferanse: oppgavereferanse,
                begrunnelse: vedtakBegrunnelseTekst,
            },
            onCompleted: () => {
                amplitude.logOppgaveGodkjent(erBeslutteroppgave);
                addUtbetalingstoast();
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
                    closeModal={() => {
                        resetFattVedtakMutation();
                        setShowModal(false);
                    }}
                    onApprove={godkjennUtbetaling}
                    error={error && somBackendfeil(error)}
                    isSending={loading}
                    totrinnsvurdering={false}
                />
            )}
        </>
    );
};

type SpesialistErrorCode = {
    message: string;
};

const somBackendfeil = (error: ApolloError): BackendFeil => {
    // Dette er hvordan spesialist returnerer feilmeldinger per 7. april 2025
    const errorCode = apolloExtensionValue<SpesialistErrorCode>(error, 'exception')?.message;

    return {
        message: errorMessages.get(errorCode || error.message) || 'Feil under fatting av vedtak',
    };
};

const errorMessages = new Map<string, string>([
    ['mangler_vurdering_av_varsler', 'Det mangler vurdering av varsler i en eller flere perioder'],
    ['ikke_aapen_saksbehandleroppgave', 'Saken er allerede utbetalt'],
    ['overlappende_utbetaling_i_infotrygd', 'Det er overlappende utbetaling/registrering i Infotrygd'],
]);
