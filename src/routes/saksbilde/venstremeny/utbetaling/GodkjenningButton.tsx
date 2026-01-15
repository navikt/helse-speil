import React, { ReactElement, ReactNode, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { Personinfo, Utbetaling } from '@io/graphql';
import { PostVedtakMutationError, usePostVedtak } from '@io/rest/generated/behandlinger/behandlinger';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

import { BackendFeil, UtbetalingModal } from './UtbetalingModal';

const useAddUtbetalingstoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Utbetalingen er sendt til oppdragssystemet',
            timeToLiveMs: 5000,
            key: generateId(),
            variant: 'success',
        });
    };
};

interface GodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    behandlingId: string;
    disabled: boolean;
    onSuccess?: () => void;
    utbetaling: Utbetaling;
    inntektsforholdReferanse: InntektsforholdReferanse;
    personinfo: Personinfo;
    vedtakBegrunnelseTekst: string;
    size: 'small' | 'medium';
}

export const GodkjenningButton = ({
    children,
    behandlingId,
    disabled = false,
    onSuccess,
    utbetaling,
    inntektsforholdReferanse,
    personinfo,
    vedtakBegrunnelseTekst,
    size,
    ...buttonProps
}: GodkjenningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const { mutate, error, isPending: loading, reset: resetFattVedtakMutation } = usePostVedtak();
    useKeyboard([{ key: Key.F6, action: () => !disabled && setShowModal(true), ignoreIfModifiers: false }]);

    const addUtbetalingstoast = useAddUtbetalingstoast();

    const godkjennUtbetaling = () => {
        void mutate(
            {
                behandlingId: behandlingId,
                data: {
                    begrunnelse: vedtakBegrunnelseTekst,
                },
            },
            {
                onSuccess: () => {
                    addUtbetalingstoast();
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
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                {children}
            </Button>
            {showModal && (
                <UtbetalingModal
                    showModal={showModal}
                    utbetaling={utbetaling}
                    inntektsforholdReferanse={inntektsforholdReferanse}
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

const somBackendfeil = (error: PostVedtakMutationError): BackendFeil => {
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode)
        return {
            message: 'Feil under fatting av vedtak. Kontakt utviklerteamet.',
        };

    switch (problemDetailsCode) {
        case 'MANGLER_TILGANG_TIL_PERSON':
            return message('Du har ikke tilgang til å fatte vedtak for denne personen');
        case 'OPPGAVE_IKKE_FUNNET':
            return message('Perioden er allerede utbetalt');
        case 'OPPGAVE_FEIL_TILSTAND':
            return message('Perioden er ikke klar til behandling');
        case 'SAKSBEHANDLER_MANGLER_BESLUTTERTILGANG':
            return message('Du har ikke beslutterrolle');
        case 'SAKSBEHANDLER_KAN_IKKE_BESLUTTE_EGEN_OPPGAVE':
            return message('Du kan ikke beslutte en sak du selv har sendt til godkjenning');
        case 'VARSLER_MANGLER_VURDERING':
            return message('Det mangler vurdering av varsler i en eller flere perioder');
        case 'OVERLAPPER_MED_INFOTRYGD':
            return message(
                'Da Speil sist synkroniserte med Infotrygd, ble det oppdaget overlappende utbetaling eller registrering i Infotrygd. Registreringen kan for eksempel være ferie.',
            );
        case 'VEDTAK_ALLEREDE_FATTET':
            return message('Vedtaket er allerede fattet');
        case 'KAN_IKKE_FATTE_VEDTAK_PÅ_ELDRE_BEHANDLING':
        case 'BEHANDLING_IKKE_FUNNET':
        case 'VEDTAKSPERIODE_IKKE_FUNNET':
        case 'TOTRINNSVURDERING_MANGLER_SAKSBEHANDLER':
        case 'VARSEL_MANGLER_VARSELDEFINISJON':
        default:
            return message(`Feil under fatting av vedtak. Kontakt utviklerteamet.`);
    }
};

const message = (message: string) => ({
    message: message,
});
