import { nanoid } from 'nanoid';
import React, { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Dropdown } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetchPersonDocument, OpphevStansAutomatiskBehandlingDocument } from '@io/graphql';
import { StansAutomatiskBehandlingModal } from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/StansAutomatiskBehandlingModal';
import { ToastObject, useAddToast } from '@state/toasts';

interface OpphevStansAutomatiskBehandlingButtonProps {
    fødselsnummer: string;
}

export function OpphevStansAutomatiskBehandlingButton({
    fødselsnummer,
}: OpphevStansAutomatiskBehandlingButtonProps): ReactElement {
    const [showModal, setShowModal] = useState(false);
    const [opphevStansAutomatiskBehandlingMutation, { error }] = useMutation(OpphevStansAutomatiskBehandlingDocument, {
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
        await opphevStansAutomatiskBehandlingMutation({
            variables: {
                fodselsnummer: fødselsnummer,
                begrunnelse: values.begrunnelse,
            },
            awaitRefetchQueries: true,
        }).then(() => {
            setShowModal(false);
            addToast(opphevStansAutomatiskBehandlingToast);
        });
    }

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>
                Opphev stans av automatisk behandling
            </Dropdown.Menu.List.Item>
            {showModal && (
                <StansAutomatiskBehandlingModal
                    closeModal={() => setShowModal(false)}
                    showModal={showModal}
                    onSubmit={onSubmit}
                    form={form}
                    error={error}
                    heading="Opphev stans av automatisk behandling"
                    buttonText="Opphev"
                />
            )}
        </>
    );
}

const opphevStansAutomatiskBehandlingToast: ToastObject = {
    key: nanoid(),
    message: 'Stans av automatisk behandling opphevet',
    variant: 'success',
    timeToLiveMs: 5000,
};
