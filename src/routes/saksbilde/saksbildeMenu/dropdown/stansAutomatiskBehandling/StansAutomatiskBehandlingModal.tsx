import React, { ReactElement } from 'react';
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form';

import { BodyShort, Button, Heading, Modal, Textarea } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema } from '@/form-schemas';
import { ApolloError } from '@apollo/client';

import styles from './StansAutomatiskBehandlingModal.module.css';

interface StansAutomatiskBehandlingModalProps {
    closeModal: () => void;
    showModal: boolean;
    onSubmit: (values: StansAutomatiskBehandlingSchema) => Promise<void>;
    form: UseFormReturn<StansAutomatiskBehandlingSchema>;
    error?: ApolloError;
    heading: string;
    buttonText: string;
}

export function StansAutomatiskBehandlingModal({
    showModal,
    closeModal,
    onSubmit,
    form,
    error,
    heading,
    buttonText,
}: StansAutomatiskBehandlingModalProps): ReactElement {
    return (
        <Modal
            aria-label="Stansautomatiskbehandlingmodal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={closeModal}
            width="850px"
        >
            <Modal.Header>
                <Heading level="1" size="medium">
                    {heading}
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
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    type="submit"
                    form="stans-automatisk-behandling-modal-form"
                    loading={form.formState.isSubmitting}
                >
                    {buttonText}
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
