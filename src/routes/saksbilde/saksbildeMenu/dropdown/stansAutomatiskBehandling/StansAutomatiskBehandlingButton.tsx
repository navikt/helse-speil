import { nanoid } from 'nanoid';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Dropdown } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetchPersonDocument, StansAutomatiskBehandlingDocument } from '@io/graphql';
import { StansAutomatiskBehandlingModal } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/StansAutomatiskBehandlingModal';
import { ToastObject, useAddToast } from '@state/toasts';

interface StansAutomatiskBehandlingButtonProps {
    fødselsnummer: string;
}

export function StansAutomatiskBehandlingButton({ fødselsnummer }: StansAutomatiskBehandlingButtonProps): ReactElement {
    const [showModal, setShowModal] = useState(false);
    const [stansAutomatiskBehandlingMutation, { error }] = useMutation(StansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });
    const addToast = useAddToast();
    const form = useForm<StansAutomatiskBehandlingSchema>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            begrunnelse: '',
        },
    });

    async function onSubmit(values: StansAutomatiskBehandlingSchema) {
        await stansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
                begrunnelse: values.begrunnelse,
            },
            awaitRefetchQueries: true,
        }).then(() => {
            setShowModal(false);
            addToast(stansAutomatiskBehandlingToast);
        });
    }

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>
                Stans automatisk behandling
            </Dropdown.Menu.List.Item>
            {showModal && (
                <StansAutomatiskBehandlingModal
                    closeModal={() => setShowModal(false)}
                    showModal={showModal}
                    onSubmit={onSubmit}
                    form={form}
                    error={error}
                    heading="Stans automatisk behandling av sykepenger"
                    buttonText="Stans automatisk behandling"
                />
            )}
        </>
    );
}

const stansAutomatiskBehandlingToast: ToastObject = {
    key: nanoid(),
    message: 'Automatisk behandling stanset',
    variant: 'success',
    timeToLiveMs: 5000,
};
