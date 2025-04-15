import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Heading, Modal, Textarea } from '@navikt/ds-react';

import { stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { zodResolver } from '@hookform/resolvers/zod';

interface StansAutomatiskBehandlingModalProps {
    fødselsnummer: string;
    onClose: () => void;
    showModal: boolean;
}

export function StansAutomatiskBehandlingModal({
    fødselsnummer,
    showModal,
    onClose,
}: StansAutomatiskBehandlingModalProps): ReactElement {
    const form = useForm<z.infer<typeof stansAutomatiskBehandlingSchema>>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            begrunnelse: '',
        },
    });

    function onSubmit(values: z.infer<typeof stansAutomatiskBehandlingSchema>) {
        // TODO send mutation til Speil
        console.log('fødselsnummer: ', fødselsnummer);
        console.log('begrunnelse: ', values.begrunnelse);
        onClose();
    }

    return (
        <Modal
            aria-label="Stansautomatiskbehandlingmodal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={onClose}
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
                <Button variant="tertiary" type="button" onClick={onClose}>
                    Avbryt
                </Button>
                {/*{error && (*/}
                {/*    <BodyShort className={styles.feilmelding}>*/}
                {/*        Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.*/}
                {/*    </BodyShort>*/}
                {/*)}*/}
            </Modal.Footer>
        </Modal>
    );
}
