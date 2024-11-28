import { nanoid } from 'nanoid';
import React, { ReactElement, ReactNode, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { ApolloError, useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import {
    Avslagstype,
    Personinfo,
    SendTilGodkjenningV2Document,
    Utbetaling,
    VedtakBegrunnelseUtfall,
} from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { apolloErrorCode } from '@utils/error';

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
    arbeidsgiverNavn: string;
    personinfo: Personinfo;
    avslagstype: Avslagstype | undefined;
    vedtakBegrunnelseTekst: string;
    size: 'small' | 'medium';
}

export const SendTilGodkjenningButton = ({
    children,
    oppgavereferanse,
    disabled = false,
    onSuccess,
    utbetaling,
    arbeidsgiverNavn,
    personinfo,
    avslagstype,
    vedtakBegrunnelseTekst,
    size,
    ...buttonProps
}: SendTilGodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const amplitude = useContext(AmplitudeContext);
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
                vedtakBegrunnelse: {
                    utfall: tilUtfall(avslagstype),
                    begrunnelse: vedtakBegrunnelseTekst,
                },
            },
            onCompleted: () => {
                amplitude.logTotrinnsoppgaveTilGodkjenning();
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
                    arbeidsgiverNavn={arbeidsgiverNavn}
                    personinfo={personinfo}
                    onClose={() => setShowModal(false)}
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
                  : 'Kunne ikke sende saken til godkjenning',
        statusCode: errorCode,
    };
};

const tilUtfall = (type: Avslagstype | undefined) => {
    switch (type) {
        case Avslagstype.Avslag:
            return VedtakBegrunnelseUtfall.Avslag;
        case Avslagstype.DelvisAvslag:
            return VedtakBegrunnelseUtfall.DelvisInnvilgelse;
        case undefined:
            return VedtakBegrunnelseUtfall.Innvilgelse;
    }
};
