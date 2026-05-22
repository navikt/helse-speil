'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Heading, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import {
    NyDialogmeldingSchema,
    fagomradeLabels,
    meldingstypeLabels,
    nyDialogmeldingSchema,
} from '@/form-schemas/nyDialogmeldingSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGetDialogmeldingerQueryKey, usePostNyDialogmelding } from '@io/rest/generated/default/default';
import { ApiDialogmeldingType, ApiFagomrade } from '@io/rest/generated/sporhund.schemas';
import { useFetchPersonQuery } from '@state/person';
import { useQueryClient } from '@tanstack/react-query';

import { BehandlerSearch } from './BehandlerSearch';

export function NyDialogmeldingForm(): ReactElement {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data: personData } = useFetchPersonQuery();
    const personinfo = personData?.person?.personinfo;
    const { mutateAsync, isPending } = usePostNyDialogmelding({
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
            fagomrade: Object.values(ApiFagomrade)[0],
            meldingstype: Object.values(ApiDialogmeldingType)[0],
            melding: '',
        },
    });

    async function onSubmit(values: NyDialogmeldingSchema) {
        if (!personinfo) return;

        const sokernavn = {
            fornavn: personinfo.fornavn,
            etternavn: personinfo.etternavn,
            mellomnavn: personinfo.mellomnavn,
        };
        const result = await mutateAsync({ pseudoId: personPseudoId, data: { ...values, sokernavn } });
        if (result) {
            router.push(`/person/${personPseudoId}/dialogmelding/${result.conversationRef}`);
        }
    }

    return (
        <section className="p-6 [grid-area:content]">
            <VStack
                as={Box}
                gap="space-24"
                borderWidth="1"
                borderColor="neutral-strong"
                background="neutral-soft"
                borderRadius="8"
                padding="space-24"
                maxWidth="800px"
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
                        gap="space-32"
                        className="max-w-250"
                        id="ny-dialogmelding-form"
                    >
                        <BehandlerSearch />
                        <Controller
                            control={form.control}
                            name="fagomrade"
                            render={({ field, fieldState }) => (
                                <RadioGroup
                                    legend="Fagområde"
                                    className="[&_legend]:text-ax-large"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    size="small"
                                >
                                    {Object.entries(fagomradeLabels).map(([value, label]) => (
                                        <Radio key={value} value={value}>
                                            <span className="text-ax-large">{label}</span>
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="meldingstype"
                            render={({ field, fieldState }) => (
                                <RadioGroup
                                    legend="Meldingstype"
                                    className="[&_legend]:text-ax-large"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    size="small"
                                >
                                    {Object.entries(meldingstypeLabels).map(([value, label]) => (
                                        <Radio key={value} value={value}>
                                            <span className="text-ax-large">{label}</span>
                                        </Radio>
                                    ))}
                                </RadioGroup>
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
                                disabled={!personinfo || isPending}
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
        </section>
    );
}
