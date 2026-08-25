import React, { ReactElement, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { PostSendIReturMutationError, usePostSendIRetur } from '@io/rest/generated/oppgaver/oppgaver';
import { somPersonFeilmelding } from '@io/rest/personFeilmeldinger';
import { Returnotat } from '@saksbilde/notat/Returnotat';
import { useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

const useAddReturtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Oppgaven er sendt i retur til saksbehandler',
            timeToLiveMs: 5000,
            key: generateId(),
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
}: ReturButtonProps): ReactElement | null => {
    const [showNotat, setShowNotat] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const addReturtoast = useAddReturtoast();

    const { mutate: sendIRetur, isPending: loading } = usePostSendIRetur();

    const closeNotat = () => {
        setError(undefined);
        setShowNotat(false);
    };

    if (!person) {
        return null;
    }

    const returnerUtbetaling = async (notattekst: string) => {
        setError(undefined);

        return new Promise<void>((resolve) => {
            sendIRetur(
                {
                    oppgaveId: Number(activePeriod.oppgave?.id),
                    data: { notatTekst: notattekst },
                },
                {
                    onSuccess: () => {
                        addReturtoast();
                        closeNotat();
                        onSuccess?.();
                        resolve();
                    },
                    onError: (error) => {
                        setError(somRestFeilmelding(error));
                        resolve();
                    },
                },
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
                <Returnotat
                    onSubmit={returnerUtbetaling}
                    setShowNotat={setShowNotat}
                    error={error}
                    person={person}
                    loading={loading}
                />
            )}
        </>
    );
};

const somRestFeilmelding = (error: PostSendIReturMutationError): string => {
    const problemDetailsCode = error.response?.data?.code;
    if (!problemDetailsCode) return 'En feil oppsto, oppgaven kunne ikke returneres';

    const personFeilmelding = somPersonFeilmelding(problemDetailsCode);
    if (personFeilmelding != null) return personFeilmelding;

    switch (problemDetailsCode) {
        case 'OPPGAVE_IKKE_FUNNET':
            return 'Perioden er allerede utbetalt';
        case 'OPPGAVE_ALLEREDE_SENDT_I_RETUR':
            return 'Denne oppgaven er allerede sendt i retur';
        case 'KREVER_TOTRINNSVURDERING_AV_ANNEN':
            return 'Du kan ikke returnere en sak du selv har sendt til godkjenning';
        case 'TOTRINNSVURDERING_IKKE_FUNNET':
        case 'TOTRINNSVURDERING_MANGLER_SAKSBEHANDLER':
        case 'KUNNE_IKKE_OPPRETTE_HISTORIKKINNSLAG':
        case 'UVENTET_MODELLFEIL':
        default:
            return 'En feil oppsto, oppgaven kunne ikke returneres';
    }
};
