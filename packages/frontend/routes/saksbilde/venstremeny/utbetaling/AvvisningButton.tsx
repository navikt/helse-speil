import { nanoid } from 'nanoid';
import React, { useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { AmplitudeContext } from '@io/amplitude';
import { postSendTilInfotrygd } from '@io/http';
import { useAddToast } from '@state/toasts';

import { AvvisningModal, Avvisningsskjema } from './AvvisningModal';

const useAddInfotrygdtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt til behandling i Infotrygd',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
    };
};

interface AvvisningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError' | 'children'> {
    activePeriod: FetchedBeregnetPeriode;
    aktørId: string;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const AvvisningButton: React.FC<AvvisningButtonProps> = ({
    activePeriod,
    aktørId,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const amplitude = useContext(AmplitudeContext);
    const addInfotrygdtoast = useAddInfotrygdtoast();

    const closeModal = () => setShowModal(false);

    const avvisUtbetaling = (skjema: Avvisningsskjema) => {
        setIsSending(true);
        const skjemaBegrunnelser: string[] = skjema.begrunnelser?.map((begrunnelse) => begrunnelse.valueOf()) ?? [];
        const skjemaKommentar: string[] = skjema.kommentar ? [skjema.kommentar] : [];
        const begrunnelser: string[] = [skjema.årsak.valueOf(), ...skjemaBegrunnelser, ...skjemaKommentar];

        postSendTilInfotrygd(activePeriod.oppgave?.id!, aktørId, skjema)
            .then(() => {
                amplitude.logOppgaveForkastet(begrunnelser);
                addInfotrygdtoast();
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
                disabled={disabled}
                variant="secondary"
                size="small"
                data-testid="avvisning-button"
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                Kan ikke behandles her
            </Button>
            {showModal && (
                <AvvisningModal
                    onClose={closeModal}
                    onApprove={avvisUtbetaling}
                    isSending={isSending}
                    activePeriod={activePeriod}
                />
            )}
        </>
    );
};
