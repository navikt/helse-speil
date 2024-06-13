import { nanoid } from 'nanoid';
import React, { ReactElement, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { AmplitudeContext } from '@io/amplitude';
import { BeregnetPeriodeFragment, PersonFragment, SendIReturDocument } from '@io/graphql';
import { useAddToast } from '@state/toasts';

import { Returnotat } from '../../notat/Returnotat';

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

interface ReturButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
    person: PersonFragment;
    activePeriod: BeregnetPeriodeFragment;
    disabled: boolean;
    onSuccess?: () => void;
}

export const ReturButton = ({
    person,
    activePeriod,
    disabled = false,
    onSuccess,
    ...buttonProps
}: ReturButtonProps): ReactElement | null => {
    const [showNotat, setShowNotat] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const addReturtoast = useAddReturtoast();
    const amplitude = useContext(AmplitudeContext);
    const [sendIReturMutation] = useMutation(SendIReturDocument);

    const closeNotat = () => {
        setError(undefined);
        setShowNotat(false);
    };

    if (!person) {
        return null;
    }

    const returnerUtbetaling = async (notattekst: string) => {
        setError(undefined);

        return sendIReturMutation({
            variables: { oppgavereferanse: activePeriod.oppgave?.id ?? '', notatTekst: notattekst },
        })
            .then(() => {
                amplitude.logTotrinnsoppgaveReturnert();
                addReturtoast();
                closeNotat();
                onSuccess?.();
            })
            .catch((error) => {
                setError(
                    error.statusCode === 401 ? 'Du har blitt logget ut' : 'En feil oppsto, saken kunne ikke returneres',
                );
            });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="secondary"
                size="small"
                data-testid="retur-button"
                onClick={() => setShowNotat(true)}
                {...buttonProps}
            >
                Returner
            </Button>
            {showNotat && <Returnotat onSubmit={returnerUtbetaling} setShowNotat={setShowNotat} error={error} />}
        </>
    );
};
