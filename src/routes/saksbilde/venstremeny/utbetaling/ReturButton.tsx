import { nanoid } from 'nanoid';
import React, { ReactElement, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { BeregnetPeriodeFragment, Maybe, PersonFragment, SendIReturDocument } from '@io/graphql';
import { Returnotat } from '@saksbilde/notat/Returnotat';
import { useAddToast } from '@state/toasts';

const useAddReturtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Oppgaven er sendt i retur til saksbehandler',
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
    size: 'small' | 'medium';
}

export const ReturButton = ({
    person,
    activePeriod,
    disabled = false,
    onSuccess,
    size,
    ...buttonProps
}: ReturButtonProps): Maybe<ReactElement> => {
    const [showNotat, setShowNotat] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const addReturtoast = useAddReturtoast();
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
                addReturtoast();
                closeNotat();
                onSuccess?.();
            })
            .catch((error) => {
                setError(
                    error.statusCode === 401
                        ? 'Du har blitt logget ut'
                        : 'En feil oppsto, oppgaven kunne ikke returneres',
                );
            });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="secondary"
                size={size}
                data-testid="retur-button"
                onClick={() => setShowNotat(true)}
                {...buttonProps}
            >
                Returner
            </Button>
            {showNotat && (
                <Returnotat onSubmit={returnerUtbetaling} setShowNotat={setShowNotat} error={error} person={person} />
            )}
        </>
    );
};
