'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, FieldErrors, FormProvider, useFieldArray, useForm, useFormState } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, ErrorMessage, HGrid, HStack, Select, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import {
    ANNEN_YTELSE_OPTIONS,
    AndreYtelserSchema,
    AndreYtelserSkjemaInput,
    lagAndreYtelserSchema,
} from '@/form-schemas/andreYtelserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    usePostGraderteAndreYtelser,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { PeriodeRad } from '@saksbilde/tilkommenInntekt/skjema/PeriodeRad';
import { tilGraderteAndreYtelserRequest } from '@saksbilde/tilkommenInntekt/skjema/andreYtelserMapping';
import { utledSykefraværstilfelleperioder } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useFetchPersonQuery } from '@state/person';
import { useQueryClient } from '@tanstack/react-query';

export function AndreYtelserSkjema(): ReactElement {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;

    const { mutate, isPending, isError } = usePostGraderteAndreYtelser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetGraderteAndreYtelserForPersonQueryKey(personPseudoId),
                });
                router.back();
            },
        },
    });

    const sykefraværstilfelleperioder = person ? utledSykefraværstilfelleperioder(person) : [];

    const form = useForm<AndreYtelserSkjemaInput, unknown, AndreYtelserSchema>({
        resolver: zodResolver(lagAndreYtelserSchema(sykefraværstilfelleperioder)),
        reValidateMode: 'onBlur',
        defaultValues: { ytelse: undefined, perioder: [tomPeriode], notat: '' },
    });

    const { errors } = useFormState({ control: form.control });
    const periodeFeilmeldinger = hentPeriodeFeilmeldinger(errors);
    const { fields, append, remove, update } = useFieldArray({ control: form.control, name: 'perioder' });

    function onSubmit(values: AndreYtelserSchema) {
        if (!person) return;
        mutate({ data: tilGraderteAndreYtelserRequest(values, person.fodselsnummer) });
    }

    function fjernPeriode(index: number) {
        if (fields.length === 1) {
            update(index, tomPeriode);
            form.clearErrors(`perioder.${index}`);
            return;
        }

        remove(index);
    }

    if (!person) return <ErrorMessage>Kunne ikke hente personinformasjon</ErrorMessage>;

    return (
        <FormProvider {...form}>
            <VStack as="form" noValidate onSubmit={form.handleSubmit(onSubmit)} gap="space-8" id="andre-ytelser-form">
                <Controller
                    control={form.control}
                    name="ytelse"
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
                            value={field.value ?? ''}
                            label="Velg ytelse"
                            size="small"
                            error={fieldState.error?.message}
                            style={{ maxWidth: '220px' }}
                        >
                            <option value="" />
                            {ANNEN_YTELSE_OPTIONS.map((ytelse) => (
                                <option key={ytelse} value={ytelse}>
                                    {ytelse}
                                </option>
                            ))}
                        </Select>
                    )}
                />
                <VStack>
                    {fields.map((field, index) => (
                        <PeriodeRad
                            key={field.id}
                            index={index}
                            onRemove={() => fjernPeriode(index)}
                            sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                        />
                    ))}
                    <HGrid columns={1} gap="space-8" align="start">
                        <Button
                            type="button"
                            variant="tertiary"
                            size="small"
                            icon={<PlusIcon />}
                            onClick={() => append(tomPeriode)}
                            style={{ justifySelf: 'start', paddingInlineStart: 'var(--ax-space-0)' }}
                        >
                            Legg til periode
                        </Button>
                    </HGrid>
                </VStack>
                <Box maxWidth="calc(var(--ax-space-128) * 3)">
                    <Controller
                        control={form.control}
                        name="notat"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label="Notat til beslutter"
                                description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                size="small"
                                error={fieldState.error?.message}
                                id="notat"
                            />
                        )}
                    />
                </Box>
                <VStack gap="space-4">
                    {periodeFeilmeldinger.map((feil) => (
                        <ErrorMessage key={feil} showIcon size="small">
                            {feil}
                        </ErrorMessage>
                    ))}
                </VStack>
                <HStack gap="space-8">
                    <Button size="small" variant="primary" type="submit" loading={isPending} disabled={isPending}>
                        Lagre
                    </Button>
                    <Button
                        size="small"
                        variant="tertiary"
                        type="button"
                        disabled={isPending}
                        onClick={() => router.back()}
                    >
                        Avbryt
                    </Button>
                </HStack>
                {isError && (
                    <Alert variant="error" size="small">
                        Klarte ikke lagre andre ytelser. Prøv igjen senere, eller kontakt en coach.
                    </Alert>
                )}
            </VStack>
        </FormProvider>
    );
}

const tomPeriode: AndreYtelserSkjemaInput['perioder'][number] = { fom: '', tom: '', grad: undefined };

function hentPeriodeFeilmeldinger(errors: FieldErrors<AndreYtelserSkjemaInput>): string[] {
    const perioder = Array.isArray(errors.perioder) ? errors.perioder : [];

    return perioder.flatMap((periode, index, allePerioder) =>
        [periode?.fom?.message, periode?.tom?.message, periode?.grad?.message]
            .filter((message): message is string => typeof message === 'string')
            .map((message) => (allePerioder.length > 1 ? `Periode ${index + 1}: ${message}` : message)),
    );
}
