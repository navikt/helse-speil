import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button, Dialog, ErrorMessage, Textarea } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FetchPersonDocument } from '@io/graphql';
import { usePatchSaksbehandlerStans } from '@io/rest/generated/personer/personer';
import {
    opphevStansAutomatiskBehandlingToast,
    somSaksbehandlerBackendfeil,
} from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/stansAutomatiskBehandlingUtils';
import { useAddToast } from '@state/toasts';

interface OpphevStansAutomatiskBehandlingDialogInnholdProps {
    fødselsnummer: string;
    onSuccess: () => void;
}

export function OpphevStansAutomatiskBehandlingDialogInnhold({
    fødselsnummer,
    onSuccess,
}: OpphevStansAutomatiskBehandlingDialogInnholdProps): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const apolloClient = useApolloClient();
    const { mutateAsync, error } = usePatchSaksbehandlerStans();
    const addToast = useAddToast();
    const form = useForm<StansAutomatiskBehandlingSchema>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            fodselsnummer: fødselsnummer,
            begrunnelse: '',
        },
    });

    async function onSubmit(values: StansAutomatiskBehandlingSchema) {
        await mutateAsync(
            {
                pseudoId: personPseudoId,
                data: {
                    begrunnelse: values.begrunnelse,
                    stans: false,
                },
            },
            {
                onSuccess: () => {
                    apolloClient.cache.modify({
                        id: apolloClient.cache.identify({ __typename: 'Person', fodselsnummer: fødselsnummer }),
                        fields: {
                            personinfo: (existing) => ({
                                ...existing,
                                automatiskBehandlingStansetAvSaksbehandler: false,
                            }),
                        },
                    });
                    apolloClient.refetchQueries({
                        include: [FetchPersonDocument],
                    });
                    onSuccess();
                    addToast(opphevStansAutomatiskBehandlingToast);
                },
            },
        );
    }

    return (
        <Dialog.Popup width="large">
            <Dialog.Header>
                <Dialog.Title>Opphev stans av automatisk behandling</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="opphev-stans-automatisk-behandling-form">
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
                {error && <ErrorMessage showIcon>{somSaksbehandlerBackendfeil(error)}</ErrorMessage>}
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.CloseTrigger>
                    <Button variant="tertiary" type="button" disabled={form.formState.isSubmitting}>
                        Avbryt
                    </Button>
                </Dialog.CloseTrigger>
                <Button
                    variant="primary"
                    type="submit"
                    form="opphev-stans-automatisk-behandling-form"
                    loading={form.formState.isSubmitting}
                >
                    Opphev
                </Button>
            </Dialog.Footer>
        </Dialog.Popup>
    );
}
