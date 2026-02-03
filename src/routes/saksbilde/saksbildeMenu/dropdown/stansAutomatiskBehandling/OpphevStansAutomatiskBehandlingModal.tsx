import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { BodyShort, Button, Heading, Modal, Textarea } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetchPersonDocument, OpphevStansAutomatiskBehandlingDocument } from '@io/graphql';
import { ToastObject, useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

import styles from './StansAutomatiskBehandlingModal.module.css';

interface OpphevStansAutomatiskBehandlingModalProps {
    fødselsnummer: string;
    closeModal: () => void;
    showModal: boolean;
}

export function OpphevStansAutomatiskBehandlingModal({
    fødselsnummer,
    showModal,
    closeModal,
}: OpphevStansAutomatiskBehandlingModalProps): ReactElement {
    const [opphevStansAutomatiskBehandlingMutation, { error }] = useMutation(OpphevStansAutomatiskBehandlingDocument, {
        refetchQueries: [FetchPersonDocument],
    });
    const addToast = useAddToast();
    const form = useForm<StansAutomatiskBehandlingSchema>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            fodselsnummer: fødselsnummer,
            begrunnelse: '',
        },
    });

    async function onSubmit(values: StansAutomatiskBehandlingSchema) {
        await opphevStansAutomatiskBehandlingMutation({
            variables: values,
            awaitRefetchQueries: true,
        }).then(() => {
            closeModal();
            addToast(opphevStansAutomatiskBehandlingToast);
        });
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
                    Opphev stans av automatisk behandling
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="opphev-stans-automatisk-behandling-modal-form">
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
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    type="submit"
                    form="opphev-stans-automatisk-behandling-modal-form"
                    loading={form.formState.isSubmitting}
                >
                    Opphev
                </Button>
                <Button variant="tertiary" type="button" disabled={form.formState.isSubmitting} onClick={closeModal}>
                    Avbryt
                </Button>
                {error && (
                    <BodyShort className={styles.feilmelding}>
                        Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.
                    </BodyShort>
                )}
            </Modal.Footer>
        </Modal>
    );
}

const opphevStansAutomatiskBehandlingToast: ToastObject = {
    key: generateId(),
    message: 'Stans av automatisk behandling opphevet',
    variant: 'success',
    timeToLiveMs: 5000,
};
