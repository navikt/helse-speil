import React, { ReactElement, ReactNode, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { PostSendTilGodkjenningMutationError, usePostSendTilGodkjenning } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiUtbetaling } from '@io/rest/generated/spesialist.schemas';
import { sporHendelse } from '@observability/hendelser';
import { useSporModal } from '@observability/useSporModal';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useInvaliderOppgaver } from '@state/oppgaver';
import { useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

import { BackendFeil, UtbetalingDialog } from './UtbetalingDialog';

const useAddSendtTilGodkjenningtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Oppgaven er sendt til beslutter',
            timeToLiveMs: 5000,
            key: generateId(),
            variant: 'success',
        });
    };
};

interface SendTilGodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    disabled: boolean;
    onSuccess?: () => void;
    utbetaling: ApiUtbetaling;
    inntektsforholdReferanse: InntektsforholdReferanse;
    vedtakBegrunnelseTekst: string;
    size: 'small' | 'medium';
}

export const SendTilGodkjenningButton = ({
    children,
    oppgavereferanse,
    disabled = false,
    onSuccess,
    utbetaling,
    inntektsforholdReferanse,
    vedtakBegrunnelseTekst,
    size,
    ...buttonProps
}: SendTilGodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const addToast = useAddSendtTilGodkjenningtoast();
    const invaliderOppgaver = useInvaliderOppgaver();

    const {
        mutate: sendTilGodkjenning,
        isPending: loading,
        error,
        reset: resetSendTilGodkjenningMutation,
    } = usePostSendTilGodkjenning();

    const sporModal = useSporModal('send-til-godkjenning');

    const åpneModal = (opprinnelse: 'knapp' | 'hurtigtast') => {
        if (showModal) return;
        sporModal.åpnet(opprinnelse);
        setShowModal(true);
    };

    useKeyboard([
        {
            key: Key.F6,
            action: () => åpneModal('hurtigtast'),
            ignoreIfModifiers: false,
        },
    ]);

    const sendTilGodkjenningHandler = async () => {
        void sendTilGodkjenning(
            {
                oppgaveId: Number(oppgavereferanse),
                data: {
                    begrunnelse: vedtakBegrunnelseTekst,
                },
            },
            {
                onSuccess: () => {
                    sporHendelse({
                        name: 'sendt til godkjenning',
                        properties: { harIndividuellBegrunnelse: vedtakBegrunnelseTekst.trim() !== '' },
                    });
                    sporModal.lukket('handlings-knapp');
                    void invaliderOppgaver();
                    addToast();
                    onSuccess?.();
                    setShowModal(false);
                },
            },
        );
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="primary"
                size={size}
                data-testid="godkjenning-button"
                onClick={() => åpneModal('knapp')}
                {...buttonProps}
            >
                {children}
            </Button>
            <UtbetalingDialog
                open={showModal}
                utbetaling={utbetaling}
                inntektsforholdReferanse={inntektsforholdReferanse}
                onOpenChange={(open) => {
                    if (!open) {
                        sporModal.lukket();
                        resetSendTilGodkjenningMutation();
                    }
                    setShowModal(open);
                }}
                onApprove={sendTilGodkjenningHandler}
                error={error ? somRestBackendfeil(error) : null}
                isSending={loading}
                totrinnsvurdering={true}
            />
        </>
    );
};

const somRestBackendfeil = (error: PostSendTilGodkjenningMutationError): BackendFeil => {
    const problemDetailsCode = error.info?.code;
    if (!problemDetailsCode)
        return {
            message: 'Kunne ikke sende oppgaven til godkjenning',
        };

    switch (problemDetailsCode) {
        case 'MANGLER_TILGANG_TIL_PERSON':
            return {
                message: 'Du har ikke tilgang til å sende denne oppgaven til godkjenning',
            };
        case 'OPPGAVE_IKKE_FUNNET':
            return {
                message: 'Perioden er allerede utbetalt',
            };
        case 'MANGLER_VURDERING_AV_VARSLER':
            return {
                message: 'Mangler vurdering av varsler',
            };
        case 'OPPGAVE_ALLEREDE_SENDT_TIL_BESLUTTER':
            return {
                message: 'Denne perioden er allerede sendt til beslutter',
            };
        case 'KREVER_TOTRINNSVURDERING_AV_ANNEN':
            return {
                message: 'Oppgaven krever vurdering av en annen saksbehandler',
            };
        case 'TOTRINNSVURDERING_IKKE_FUNNET':
        case 'UVENTET_MODELLFEIL':
        default:
            return {
                message: 'Kunne ikke sende oppgaven til godkjenning',
            };
    }
};
