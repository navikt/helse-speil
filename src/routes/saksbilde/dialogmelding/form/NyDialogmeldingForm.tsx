'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Select, Textarea, VStack } from '@navikt/ds-react';

import { NyDialogmeldingSchema, fagomradeLabels, nyDialogmeldingSchema } from '@/form-schemas/nyDialogmeldingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGetDialogmeldingerQueryKey, usePostDialogmelding } from '@io/rest/generated/default/default';
import { useQueryClient } from '@tanstack/react-query';

import { BehandlerSearch } from './BehandlerSearch';

export function NyDialogmeldingForm(): ReactElement {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = usePostDialogmelding({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetDialogmeldingerQueryKey(personPseudoId) });
            },
        },
    });
    const form = useForm<NyDialogmeldingSchema>({
        resolver: zodResolver(nyDialogmeldingSchema),
        defaultValues: {
            behandler: undefined,
            fagomrade: undefined,
            melding: '',
        },
    });

    async function onSubmit(values: NyDialogmeldingSchema) {
        const result = await mutateAsync({ pseudoId: personPseudoId, data: values });
        if (result) {
            router.push(`/person/${personPseudoId}/dialogmelding/${result.id}`);
        }
    }

    return (
        <VStack
            as="section"
            paddingInline="space-16"
            paddingBlock="space-16"
            gap="space-16"
            className="[grid-area:content]"
        >
            <HStack justify="space-between" align="center">
                <Heading level="2" size="medium">
                    Ny dialogmelding
                </Heading>
                <Button variant="tertiary" size="small" onClick={() => router.back()}>
                    Avbryt
                </Button>
            </HStack>
            <FormProvider {...form}>
                <VStack
                    as="form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    gap="space-16"
                    className="max-w-250"
                    id="ny-dialogmelding-form"
                >
                    <BehandlerSearch />
                    <Controller
                        control={form.control}
                        name="fagomrade"
                        render={({ field, fieldState }) => (
                            <Select {...field} label="Fagområde" error={fieldState.error?.message}>
                                <option value="">Velg fagområde</option>
                                {Object.entries(fagomradeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="melding"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                className="whitespace-pre-line"
                                label="Melding"
                                description="Skriv din melding til behandler"
                                minRows={6}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <HStack gap="space-16">
                        <Button
                            size="small"
                            variant="primary"
                            type="submit"
                            icon={<PaperplaneIcon />}
                            loading={isPending}
                        >
                            Send melding
                        </Button>
                        <Button
                            size="small"
                            variant="tertiary"
                            type="button"
                            onClick={() => router.back()}
                            icon={<TrashIcon />}
                            disabled={isPending}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </VStack>
            </FormProvider>
        </VStack>
    );
}
