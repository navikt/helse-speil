import { nanoid } from 'nanoid';
import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { BodyShort, Button, Heading, Modal, Textarea } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStansAutomatiskBehandling } from '@hooks/stansAutomatiskBehandling';
import { useAddToast } from '@state/toasts';

import styles from './StansAutomatiskBehandlingModal.module.css';

interface StansAutomatiskBehandlingModalProps {
    fødselsnummer: string;
    closeModal: () => void;
    showModal: boolean;
}

export function StansAutomatiskBehandlingModal({
    fødselsnummer,
    showModal,
    closeModal,
}: StansAutomatiskBehandlingModalProps): ReactElement {
    const addToast = useAddToast();
    const [stansAutomatiskBehandling, { error }] = useStansAutomatiskBehandling();
    const form = useForm<StansAutomatiskBehandlingSchema>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            begrunnelse: '',
        },
    });

    async function onSubmit(values: StansAutomatiskBehandlingSchema) {
        await stansAutomatiskBehandling(fødselsnummer, values.begrunnelse).then(() => {
            closeModal();
            addToast({
                key: nanoid(),
                message: 'Automatisk behandling stanset',
                variant: 'success',
                timeToLiveMs: 5000,
            });
        });
    }

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
                                    maxLength={1000}
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
                    Stans automatisk behandling
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
