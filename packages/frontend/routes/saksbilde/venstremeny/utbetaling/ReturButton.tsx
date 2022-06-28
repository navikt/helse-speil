import React, { useContext, useState } from 'react';
import { Button } from '@navikt/ds-react';

import { BeregnetPeriode } from '@io/graphql';
import { AmplitudeContext } from '@io/amplitude';
import { postSendTilbakeTilSaksbehandler } from '@io/http';
import { useCurrentPerson } from '@state/person';
import { useAddVarsel } from '@state/varsler';
import { SuccessAlert } from '@utils/error';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';

const useAddInfotrygdtoast = () => {
    const timeToLiveMS = 5000;
    const addVarsel = useAddVarsel();

    return () => {
        addVarsel(new SuccessAlert('Saken er sendt i retur til saksbehandler.', { timeToLiveMS }));
    };
};

interface ReturButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError' | 'children'> {
    activePeriod: BeregnetPeriode;
    disabled: boolean;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const ReturButton: React.VFC<ReturButtonProps> = ({
    activePeriod,
    disabled = false,
    onSuccess,
    onError,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [_isSending, setIsSending] = useState(false);

    const addInfotrygdtoast = useAddInfotrygdtoast();
    const person = useCurrentPerson();
    const amplitude = useContext(AmplitudeContext);

    const closeModal = () => setShowModal(false);

    if (!person) {
        return null;
    }
    const personinfo = person.personinfo;

    const returnerUtbetaling = (notattekst: string) => {
        setIsSending(true);

        postSendTilbakeTilSaksbehandler(activePeriod.oppgavereferanse!, {
            tekst: notattekst,
            type: 'Retur',
        })
            .then(() => {
                amplitude.logTotrinnsoppgaveReturnert();
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
