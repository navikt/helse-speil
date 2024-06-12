import { nanoid } from 'nanoid';
import React, { ReactElement, useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { AmplitudeContext } from '@io/amplitude';
import { BeregnetPeriodeFragment, Handling, Periodehandling, TilInfoTrygdDocument } from '@io/graphql';
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
    activePeriod: BeregnetPeriodeFragment;
    disabled: boolean;
    onSuccess?: () => void;
}

const finnKanAvvises = ({ handlinger }: BeregnetPeriodeFragment): Handling | null =>
    handlinger.find((handling) => handling.type === Periodehandling.Avvise) as Handling;

export const AvvisningButton = ({
    activePeriod,
    disabled = false,
    onSuccess,
    ...buttonProps
}: AvvisningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const [kanIkkeAvvisesMelding, setKanIkkeAvvisesMelding] = useState<string | null>();
    const [sendTilInfotrygdMutation, { error, loading }] = useMutation(TilInfoTrygdDocument);

    const amplitude = useContext(AmplitudeContext);
    const addInfotrygdtoast = useAddInfotrygdtoast();
    const kanAvvises = finnKanAvvises(activePeriod);

    const closeModal = () => {
        setShowModal(false);
    };
    const avvisUtbetaling = async (skjema: Avvisningsskjema) => {
        const skjemaBegrunnelser: string[] = skjema.begrunnelser?.map((begrunnelse) => begrunnelse.valueOf()) ?? [];
        const skjemaKommentar: string[] = skjema.kommentar ? [skjema.kommentar] : [];

        await sendTilInfotrygdMutation({
            variables: {
                oppgavereferanse: activePeriod.oppgave?.id ?? '',
                kommentar: skjema.kommentar,
                begrunnelser: skjemaBegrunnelser,
                arsak: skjema.årsak.valueOf(),
            },
            onCompleted: () => {
                amplitude.logOppgaveForkastet([skjema.årsak.valueOf(), ...skjemaBegrunnelser, ...skjemaKommentar]);
                addInfotrygdtoast();
                closeModal();
                onSuccess?.();
            },
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
                        isSending={loading}
                        activePeriod={activePeriod}
                        error={
                            error
                                ? error.graphQLErrors[0].extensions.code === 409
                                    ? 'Saken er allerede avvist'
                                    : 'En feil har oppstått'
                                : null
                        }
                    />
                )
            )}
        </>
    );
};
