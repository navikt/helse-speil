'use client';

import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PaperclipIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { Bleed, Box, Button, Heading, Textarea, VStack } from '@navikt/ds-react';

import { SvarPåDialogSchema, svarPåDialogSchema } from '@/form-schemas/svarPåDialogSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGetDialogmeldingQueryKey, usePostSvarPaDialog } from '@io/rest/generated/default/default';
import { useQueryClient } from '@tanstack/react-query';

export function SvarPåDialogForm(): ReactElement {
    const { personPseudoId, dialogId } = useParams<{ personPseudoId: string; dialogId: string }>();
    const queryClient = useQueryClient();
    const { mutate, isPending } = usePostSvarPaDialog({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetDialogmeldingQueryKey(personPseudoId, dialogId) });
                form.reset();
            },
        },
    });
    const form = useForm<SvarPåDialogSchema>({
        resolver: zodResolver(svarPåDialogSchema),
        defaultValues: { melding: '' },
    });

    function onSubmit({ melding }: SvarPåDialogSchema) {
        mutate({ pseudoId: personPseudoId, dialogId, data: { melding } });
    }

    return (
        <Bleed marginInline="space-16" marginBlock="space-0 space-16" reflectivePadding asChild>
            <Box borderWidth="1 0 0 0" borderColor="neutral-subtle" background="neutral-soft">
                <VStack as="form" onSubmit={form.handleSubmit(onSubmit)} gap="space-16" className="pt-4">
                    <Heading size="small">Svar på melding</Heading>
                    <Controller
                        control={form.control}
                        name="melding"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label="Send melding til behandler"
                                minRows={4}
                                className="max-w-250"
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <VStack gap="space-8" className="mb-3">
                        <Heading size="xsmall">Vedlegg</Heading>
                        <Button
                            variant="secondary"
                            size="small"
                            icon={<PaperclipIcon aria-hidden />}
                            className="self-start"
                            type="button"
                        >
                            Legg til vedlegg
                        </Button>
                    </VStack>
                    <Button
                        variant="primary"
                        size="small"
                        icon={<PaperplaneIcon aria-hidden />}
                        type="submit"
                        loading={isPending}
                        className="self-start"
                    >
                        Send svar
                    </Button>
                </VStack>
            </Box>
        </Bleed>
    );
}
