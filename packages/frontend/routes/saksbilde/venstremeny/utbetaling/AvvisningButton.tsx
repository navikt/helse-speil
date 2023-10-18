import { nanoid } from 'nanoid';
import React, { useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { AmplitudeContext } from '@io/amplitude';
import { Handling, Periodehandling, TilInfoTrygdDocument } from '@io/graphql';
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
    disabled: boolean;
    onSuccess?: () => void;
}

const finnKanAvvises = ({ handlinger }: FetchedBeregnetPeriode): Handling | null =>
    handlinger.find((handling) => handling.type === Periodehandling.Avvise) as Handling;

export const AvvisningButton: React.FC<AvvisningButtonProps> = ({
    activePeriod,
    disabled = false,
    onSuccess,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [kanIkkeAvvisesMelding, setKanIkkeAvvisesMelding] = useState<string | null>();
    const [sendTilInfotrygdMutation] = useMutation(TilInfoTrygdDocument);

    const amplitude = useContext(AmplitudeContext);
    const addInfotrygdtoast = useAddInfotrygdtoast();
    const kanAvvises = finnKanAvvises(activePeriod);

    const closeModal = () => {
        setError(null);
        setShowModal(false);
    };
    const avvisUtbetaling = (skjema: Avvisningsskjema) => {
        setError(null);
        setIsSending(true);
        const skjemaBegrunnelser: string[] = skjema.begrunnelser?.map((begrunnelse) => begrunnelse.valueOf()) ?? [];
        const skjemaKommentar: string[] = skjema.kommentar ? [skjema.kommentar] : [];

        sendTilInfotrygdMutation({
            variables: {
                oppgavereferanse: activePeriod.oppgave?.id ?? '',
                kommentar: skjema.kommentar,
                begrunnelser: skjemaBegrunnelser,
                arsak: skjema.årsak.valueOf(),
            },
        })
            .then(() => {
                amplitude.logOppgaveForkastet([skjema.årsak.valueOf(), ...skjemaBegrunnelser, ...skjemaKommentar]);
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
                onClick={() =>
                    kanAvvises?.tillatt
                        ? setShowModal(true)
                        : setKanIkkeAvvisesMelding('Denne saken er det noe krøll med. Du må annullere saken')
                }
                {...buttonProps}
            >
                Kan ikke behandles her
            </Button>
            {kanIkkeAvvisesMelding ? (
                <ErrorMessage>{kanIkkeAvvisesMelding}</ErrorMessage>
            ) : (
                showModal && (
                    <AvvisningModal
                        onClose={closeModal}
                        onApprove={avvisUtbetaling}
                        isSending={isSending}
                        activePeriod={activePeriod}
                        error={error}
                    />
                )
            )}
        </>
    );
};
