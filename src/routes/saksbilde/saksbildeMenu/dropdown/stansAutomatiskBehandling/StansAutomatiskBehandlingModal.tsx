import { useParams } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button, ErrorMessage, Heading, Modal, Textarea } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePatchStans } from '@io/rest/generated/stans-av-automatisering/stans-av-automatisering';
import {
    somAutomatiskStansBackendfeil,
    stansAutomatiskBehandlingToast,
} from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/stansAutomatiskBehandlingUtils';
import { useAddToast } from '@state/toasts';

interface StansAutomatiskBehandlingModalProps {
    fødselsnummer: string;
    closeModal: () => void;
    showModal: boolean;
}

export function StansAutomatiskBehandlingModal({
    fødselsnummer,
    showModal,
    closeModal,
}: StansAutomatiskBehandlingModalProps): ReactElement | null {
    const [loading, setLoading] = useState<boolean>(false);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { cache } = useApolloClient();
    const { mutate: stansAutomatiskBehandlingMutation, error } = usePatchStans();
    const addToast = useAddToast();
    const form = useForm<StansAutomatiskBehandlingSchema>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            fodselsnummer: fødselsnummer,
            begrunnelse: '',
        },
    });

    async function onSubmit(values: StansAutomatiskBehandlingSchema) {
        setLoading(true);
        stansAutomatiskBehandlingMutation(
            {
                pseudoId: personPseudoId,
                data: {
                    begrunnelse: values.begrunnelse,
                    saksbehandlerStans: true,
                },
            },
            {
                onSuccess: () => {
                    cache.modify({
                        id: cache.identify({ __typename: 'Person', fodselsnummer: fødselsnummer }),
                        fields: {
                            personinfo: (existing) => ({
                                ...existing,
                                automatiskBehandlingStansetAvSaksbehandler: true,
                            }),
                        },
                    });
                    setLoading(false);
                    closeModal();
                    addToast(stansAutomatiskBehandlingToast);
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    }

    return (
        <Modal
            aria-label="Stansautomatiskbehandlingmodal"
            closeOnBackdropClick
            open={showModal}
            onClose={closeModal}
            width="850px"
        >
            <Modal.Header>
                <Heading level="1" size="medium">
                    Stans automatisk behandling av sykepenger
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="stans-automatisk-behandling-modal-form">
                        <Controller
                            control={form.control}
                            name="begrunnelse"
                            render={({ field, fieldState }) => (
                                <Textarea
                                    {...field}
                                    error={fieldState.error?.message}
                                    label="Begrunnelse"
                                    description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                                    maxLength={2000}
                                />
                            )}
                        />
                    </form>
                </FormProvider>
                {error && <ErrorMessage showIcon>{somAutomatiskStansBackendfeil(error)}</ErrorMessage>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="stans-automatisk-behandling-modal-form" loading={loading}>
                    Stans automatisk behandling
                </Button>
                <Button variant="tertiary" type="button" disabled={loading} onClick={closeModal}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
