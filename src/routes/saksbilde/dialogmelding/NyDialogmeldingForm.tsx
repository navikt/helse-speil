'use client';

import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Select, TextField, Textarea, VStack } from '@navikt/ds-react';

import { zodResolver } from '@hookform/resolvers/zod';

export type NyDialogmeldingSchema = z.infer<typeof nyDialogmeldingSchema>;
export const nyDialogmeldingSchema = z.object({
    behandler: z.string().min(1, { error: 'Fyll inn behandler' }),
    type: z.string().min(1, { error: 'Velg type' }),
    melding: z.string().min(1, { error: 'Fyll inn begrunnelse' }),
});

export function NyDialogmeldingForm(): ReactElement {
    const router = useRouter();
    const form = useForm<NyDialogmeldingSchema>({
        resolver: zodResolver(nyDialogmeldingSchema),
        defaultValues: {
            behandler: '',
            type: 'Legeerklæring',
            melding: '',
        },
    });

    function onSubmit(values: NyDialogmeldingSchema) {
        console.log(values);
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
                    {/* Må byttes til combobox elns */}
                    <Controller
                        control={form.control}
                        name="behandler"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Behandler"
                                description="Velg behandler som skal motta meldingen"
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                            <Select
                                {...field}
                                label="Type melding"
                                description="Velg type melding"
                                error={fieldState.error?.message}
                            >
                                {meldingType.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
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
                        <Button size="small" variant="primary" type="submit" icon={<PaperplaneIcon />}>
                            Send melding
                        </Button>
                        <Button
                            size="small"
                            variant="tertiary"
                            type="button"
                            onClick={() => router.back()}
                            icon={<TrashIcon />}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </VStack>
            </FormProvider>
        </VStack>
    );
}

const meldingType = ['Legeerklæring', 'Annen type', 'Tredje type'];
