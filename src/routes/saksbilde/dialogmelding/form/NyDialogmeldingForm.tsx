'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { PaperplaneIcon, TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HStack, Heading, Loader, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';

import { NyDialogmeldingSchema, fagomradeLabels, nyDialogmeldingSchema } from '@/form-schemas/nyDialogmeldingSkjema';
import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
import { DialogmeldingMal, useDialogmeldingMaler } from '@external/sanity';
import { zodResolver } from '@hookform/resolvers/zod';
import { getGetDialogmeldingerQueryKey, usePostNyDialogmelding } from '@io/rest/generated/default/default';
import { ApiFagomrade } from '@io/rest/generated/sporhund.schemas';
import { useFetchPersonQuery } from '@state/person';
import { useQueryClient } from '@tanstack/react-query';

import { BehandlerSearch } from './BehandlerSearch';

export function NyDialogmeldingForm(): ReactElement {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data: personData } = useFetchPersonQuery();
    const { maler, error: malerError, isPending: malerIsPending, refetch } = useDialogmeldingMaler();
    const personinfo = personData?.person?.personinfo;
    const [enkeltstandeType, setEnkeltstandeType] = useState<EnkeltståndeType | null>(null);
    const malerById = Object.fromEntries(maler.map((mal: DialogmeldingMal) => [mal._id, mal]));

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
            fagomrade: undefined,
            melding: '',
        },
    });

    const fagomrade = useWatch({ control: form.control, name: 'fagomrade' });

    async function onSubmit(values: NyDialogmeldingSchema) {
        if (!personinfo || !values.behandler) return;
        const { behandler, ...rest } = values;

        const soker = {
            fodselsdato: personinfo.fodselsdato,
            navn: {
                fornavn: personinfo.fornavn,
                etternavn: personinfo.etternavn,
                mellomnavn: personinfo.mellomnavn,
            },
        };
        const result = await mutateAsync({ pseudoId: personPseudoId, data: { ...rest, behandler, soker } });
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
                                    value={field.value ?? ''}
                                    onChange={(value: ApiFagomrade) => {
                                        field.onChange(value);
                                        setEnkeltstandeType(null);
                                        if (value !== ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER) {
                                            const malId = fagområdeToMalId[value as keyof typeof fagområdeToMalId];
                                            const mal = malId ? malerById[malId] : undefined;
                                            form.setValue('melding', mal ? mal.tekst : '', {
                                                shouldValidate: true,
                                            });
                                        } else {
                                            form.setValue('melding', '');
                                        }
                                    }}
                                    error={fieldState.error?.message}
                                    size="small"
                                    disabled={malerIsPending}
                                >
                                    {Object.entries(fagomradeLabels).map(([value, label]) => (
                                        <Radio key={value} value={value}>
                                            <span className="text-ax-large">{label}</span>
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                        {fagomrade === ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER && (
                            <RadioGroup
                                legend="Type"
                                className="[&_legend]:text-ax-large"
                                value={enkeltstandeType ?? ''}
                                onChange={(value: EnkeltståndeType) => {
                                    setEnkeltstandeType(value);
                                    const malId = enkeltståndeMalId[value];
                                    const mal = malId ? malerById[malId] : undefined;
                                    form.setValue('melding', mal ? mal.tekst : '', {
                                        shouldValidate: true,
                                    });
                                }}
                                size="small"
                            >
                                <Radio value="ny">
                                    <span className="text-ax-large">Ny</span>
                                </Radio>
                                <Radio value="forlengelse">
                                    <span className="text-ax-large">Forlengelse</span>
                                </Radio>
                            </RadioGroup>
                        )}
                        {malerError && (
                            <ErrorMessageWithRefetch
                                errorMessage="Klarte ikke hente maler. Du kan fortsatt sende melding eller prøve å hente de igjen."
                                refetch={refetch}
                            />
                        )}
                        {malerIsPending && (
                            <HStack gap="space-4">
                                <BodyShort className="text-ax-text-neutral-subtle">Henter maler...</BodyShort>
                                <Loader size="small" />
                            </HStack>
                        )}
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

type EnkeltståndeType = 'ny' | 'forlengelse';

const fagområdeToMalId: Record<Exclude<ApiFagomrade, typeof ApiFagomrade.ENKELTSTAENDE_BEHANDLINGSDAGER>, string> = {
    [ApiFagomrade.BESTRIDELSE]: 'dialogmeldingmalBestridelse',
    [ApiFagomrade.YRKESSKADE]: 'dialogmeldingmalYrkesskade',
    [ApiFagomrade.TILBAKEDATERING]: 'dialogmeldingmalTilbakedatering',
};

const enkeltståndeMalId: Record<EnkeltståndeType, string> = {
    ny: 'dialogmeldingmalEnkeltstandeNy',
    forlengelse: 'dialogmeldingmalEnkeltstandeForlengelse',
};
