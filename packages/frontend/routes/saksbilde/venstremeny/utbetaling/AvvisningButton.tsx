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
}

export const AvvisningButton: React.FC<AvvisningButtonProps> = ({
    activePeriod,
    aktørId,
    disabled = false,
    onSuccess,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const amplitude = useContext(AmplitudeContext);
    const addInfotrygdtoast = useAddInfotrygdtoast();

    const closeModal = () => {
        setError(null);
        setShowModal(false);
    };
    const avvisUtbetaling = (skjema: Avvisningsskjema) => {
        setError(null);
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
                const errorMessage = error.statusCode === 409 ? 'Saken er allerede avvist' : 'En feil har oppstått';
                setError(errorMessage);
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
                    error={error}
                />
            )}
        </>
    );
};
