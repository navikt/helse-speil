import React, { ReactElement, ReactNode, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { erProd } from '@/env';
import { ApolloError, useMutation } from '@apollo/client';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { Personinfo, SendTilGodkjenningV2Document, Utbetaling } from '@io/graphql';
import { PostSendTilGodkjenningMutationError, usePostSendTilGodkjenning } from '@io/rest/generated/oppgaver/oppgaver';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAddToast } from '@state/toasts';
import { apolloErrorCode } from '@utils/error';
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
    utbetaling: Utbetaling;
    inntektsforholdReferanse: InntektsforholdReferanse;
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
    inntektsforholdReferanse,
    personinfo,
    vedtakBegrunnelseTekst,
    size,
    ...buttonProps
}: SendTilGodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const addToast = useAddSendtTilGodkjenningtoast();

    const [sendTilGodkjenningMutation, { loading: graphqlLoading, error: graphqlError }] =
        useMutation(SendTilGodkjenningV2Document);
    const {
        mutate: sendTilGodkjenningRest,
        isPending: restLoading,
        error: restError,
        reset: resetSendTilGodkjenningMutation,
    } = usePostSendTilGodkjenning();

    const loading = !erProd ? restLoading : graphqlLoading;
    const error = !erProd
        ? restError && somRestBackendfeil(restError)
        : graphqlError && somGraphqlBackendfeil(graphqlError);

    useKeyboard([
        {
            key: Key.F6,
            action: () => setShowModal(true),
            ignoreIfModifiers: false,
        },
    ]);

    const sendTilGodkjenning = async () => {
        if (!erProd) {
            void sendTilGodkjenningRest(
                {
                    oppgaveId: Number(oppgavereferanse),
                    data: {
                        begrunnelse: vedtakBegrunnelseTekst,
                    },
                },
                {
                    onSuccess: () => {
                        addToast();
                        onSuccess?.();
                        setShowModal(false);
                    },
                },
            );
        } else {
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
        }
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
            <UtbetalingDialog
                open={showModal}
                utbetaling={utbetaling}
                inntektsforholdReferanse={inntektsforholdReferanse}
                personinfo={personinfo}
                onOpenChange={(open) => {
                    if (!open) {
                        resetSendTilGodkjenningMutation();
                    }
                    setShowModal(open);
                }}
                onApprove={sendTilGodkjenning}
                error={error ?? null}
                isSending={loading}
                totrinnsvurdering={true}
            />
        </>
    );
};

const somRestBackendfeil = (error: PostSendTilGodkjenningMutationError): BackendFeil => {
    const problemDetailsCode = error.response?.data?.code;
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

const somGraphqlBackendfeil = (error: ApolloError): BackendFeil => {
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
