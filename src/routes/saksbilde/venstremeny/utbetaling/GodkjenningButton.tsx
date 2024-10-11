import { nanoid } from 'nanoid';
import React, { ReactElement, ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { AvslagInput, InnvilgVedtakDocument, Maybe, Personinfo, Utbetaling } from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { apolloErrorCode } from '@utils/error';

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
    arbeidsgiver: string;
    personinfo: Personinfo;
    avslag: Maybe<AvslagInput>;
    size: 'small' | 'medium';
}

export const GodkjenningButton = ({
    children,
    oppgavereferanse,
    erBeslutteroppgave,
    disabled = false,
    onSuccess,
    utbetaling,
    arbeidsgiver,
    personinfo,
    avslag = null,
    size,
    ...buttonProps
}: GodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const [innvilgVedtakMutation, { error, loading }] = useMutation(InnvilgVedtakDocument);
    useKeyboard([{ key: Key.F6, action: () => !disabled && setShowModal(true), ignoreIfModifiers: false }]);

    const amplitude = useContext(AmplitudeContext);
    const addUtbetalingstoast = useAddUtbetalingstoast();

    const godkjennUtbetaling = () => {
        void innvilgVedtakMutation({
            variables: { oppgavereferanse: oppgavereferanse, avslag: avslag },
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
                    arbeidsgiver={arbeidsgiver}
                    personinfo={personinfo}
                    onClose={() => setShowModal(false)}
                    onApprove={godkjennUtbetaling}
                    error={error && somBackendfeil(error)}
                    isSending={loading}
                    totrinnsvurdering={false}
                />
            )}
        </>
    );
};

const somBackendfeil = (error: ApolloError): BackendFeil => ({
    message: errorMessages.get(error.message) || 'Feil under fatting av vedtak',
    statusCode: apolloErrorCode(error),
});

const errorMessages = new Map<string, string>([
    ['mangler_vurdering_av_varsler', 'Det mangler vurdering av varsler i en eller flere perioder'],
    ['ikke_aapen_saksbehandleroppgave', 'Saken er allerede utbetalt'],
    ['ikke_tilgang_til_risk_qa', 'Du har ikke tilgang til å behandle risk-saker'],
]);
