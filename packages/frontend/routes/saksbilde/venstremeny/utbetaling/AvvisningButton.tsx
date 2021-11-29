import React, { useContext, useState } from 'react';
import { Button } from '@navikt/ds-react';
import { AvvisningModal, Avvisningsskjema } from './AvvisningModal';
import { postSendTilInfotrygd } from '../../../../io/http';
import { AmplitudeContext } from '../../AmplitudeContext';
import { Scopes, useAddEphemeralVarsel } from '../../../../state/varsler';
import { nanoid } from 'nanoid';

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
    aktivPeriode: Tidslinjeperiode;
    oppgavereferanse: string;
    aktørId: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const AvvisningButton: React.VFC<AvvisningButtonProps> = ({
    aktivPeriode,
    oppgavereferanse,
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

        postSendTilInfotrygd(oppgavereferanse, aktørId, skjema)
            .then(() => {
                amplitude.logOppgaveForkastet(begrunnelser);
                addInfotrygdtoast();
                onSuccess?.();
                closeModal();
            })
            .catch(onError)
            .finally(() => setIsSending(false));
    };

    return (
        <>
            <Button variant="secondary" size="small" {...buttonProps}>
                Kan ikke behandles her
            </Button>
            {showModal && (
                <AvvisningModal
                    onClose={closeModal}
                    onApprove={avvisUtbetaling}
                    isSending={isSending}
                    aktivPeriode={aktivPeriode}
                />
            )}
        </>
    );
};
