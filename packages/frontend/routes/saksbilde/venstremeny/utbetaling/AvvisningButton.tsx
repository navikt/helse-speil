import React, { useContext, useState } from 'react';
import { nanoid } from 'nanoid';
import { Button } from '@navikt/ds-react';

import { BeregnetPeriode } from '@io/graphql';
import { postSendTilInfotrygd } from '@io/http';
import { Scopes, useAddEphemeralVarsel } from '@state/varsler';

import { AvvisningModal, Avvisningsskjema } from './AvvisningModal';

import { AmplitudeContext } from '../../AmplitudeContext';

const useAddInfotrygdtoast = () => {
    const timeToLiveMs = 5000;
    const addVarsel = useAddEphemeralVarsel();

    return () => {
        addVarsel(
            {
                key: nanoid(),
                message: 'Saken er sendt til behandling i Infotrygd.',
                type: 'suksess',
                scope: Scopes.GLOBAL,
            },
            timeToLiveMs
        );
    };
};

interface AvvisningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError' | 'children'> {
    activePeriod: BeregnetPeriode;
    aktørId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const AvvisningButton: React.VFC<AvvisningButtonProps> = ({
    activePeriod,
    aktørId,
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

        postSendTilInfotrygd(activePeriod.oppgavereferanse!, aktørId, skjema)
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
