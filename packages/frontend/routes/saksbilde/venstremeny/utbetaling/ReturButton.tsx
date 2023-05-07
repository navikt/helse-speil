// @ts-ignore
import { nanoid } from 'nanoid';
import React, { useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { AmplitudeContext } from '@io/amplitude';
import { postSendTilbakeTilSaksbehandler } from '@io/http';
import { useCurrentPerson } from '@state/person';
import { useAddToast } from '@state/toasts';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';

const useAddReturtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt i retur til saksbehandler',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
    };
};

interface ReturButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError' | 'children'> {
    activePeriod: FetchedBeregnetPeriode;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const ReturButton: React.FC<ReturButtonProps> = ({
    activePeriod,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [_isSending, setIsSending] = useState(false);

    const addReturtoast = useAddReturtoast();
    const person = useCurrentPerson();
    const amplitude = useContext(AmplitudeContext);

    const closeModal = () => setShowModal(false);

    if (!person) {
        return null;
    }
    const personinfo = person.personinfo;

    const returnerUtbetaling = (notattekst: string) => {
        setIsSending(true);

        postSendTilbakeTilSaksbehandler(activePeriod.oppgave?.id!, {
            tekst: notattekst,
            type: 'Retur',
        })
            .then(() => {
                amplitude.logTotrinnsoppgaveReturnert();
                addReturtoast();
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
                data-testid="retur-button"
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                Returner
            </Button>
            {showModal && (
                <NyttNotatModal
                    onClose={() => setShowModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                    onSubmitOverride={returnerUtbetaling}
                    notattype="Retur"
                />
            )}
        </>
    );
};
