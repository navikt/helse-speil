'use client';

import React, { ReactElement } from 'react';
import {
    Controller,
    DefaultValues,
    FieldErrors,
    FormProvider,
    useFieldArray,
    useForm,
    useFormState,
} from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { Alert, Button, ErrorMessage, HGrid, HStack, Select, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import {
    ANNEN_YTELSE_OPTIONS,
    AndreYtelserSchema,
    AndreYtelserSkjemaInput,
    lagAndreYtelserSchema,
} from '@/form-schemas/andreYtelserSchema';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { zodResolver } from '@hookform/resolvers/zod';
import { PeriodeRad } from '@saksbilde/andreYtelser/skjema/PeriodeRad';
import { utledSykefraværstilfelleperioder } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useSistValgtePeriode } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';

import { useAlleGraderteAndreYtelser } from '../useAlleGraderteAndreYtelser';

export const tomPeriode: AndreYtelserSkjemaInput['perioder'][number] = { fom: '', tom: '', grad: undefined };

type PeriodeFeil = { fom?: { message?: string }; tom?: { message?: string }; grad?: { message?: string } };

export const tomtAndreYtelserSkjema: DefaultValues<AndreYtelserSkjemaInput> = {
    ytelse: undefined,
    perioder: [tomPeriode],
    notat: '',
};

interface AndreYtelserSkjemaProps {
    /** Startverdier. Utelates ved «legg til», settes fra eksisterende ytelse ved endring og gjenoppretting. */
    defaultValues?: DefaultValues<AndreYtelserSkjemaInput>;
    /** Id-en til ytelsen som endres/gjenopprettes, slik at den ikke sjekkes mot seg selv i graderingssjekken. */
    gjeldendeAndreYtelserId?: string;
    onSubmit: (values: AndreYtelserSchema) => void;
    onAvbryt: () => void;
    isPending?: boolean;
    isError?: boolean;
    feilmelding?: string;
    submitLabel?: string;
}

export function AndreYtelserSkjema({
    defaultValues = tomtAndreYtelserSkjema,
    gjeldendeAndreYtelserId,
    onSubmit,
    onAvbryt,
    isPending = false,
    isError = false,
    feilmelding = 'Klarte ikke lagre andre ytelser. Prøv igjen senere, eller kontakt en coach.',
    submitLabel = 'Lagre',
}: AndreYtelserSkjemaProps): ReactElement {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const aktivPeriode = useSistValgtePeriode(person);

    const sykefraværstilfelleperioder = person ? utledSykefraværstilfelleperioder(person) : [];
    const alleYtelser = useAlleGraderteAndreYtelser().ytelser ?? [];
    const form = useForm<AndreYtelserSkjemaInput, unknown, AndreYtelserSchema>({
        resolver: zodResolver(lagAndreYtelserSchema(sykefraværstilfelleperioder, alleYtelser, gjeldendeAndreYtelserId)),
        reValidateMode: 'onBlur',
        defaultValues,
    });

    const { errors } = useFormState({ control: form.control });
    const periodeFeilmeldinger = hentPeriodeFeilmeldinger(errors);
    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'perioder' });

    const hasErrors = Object.keys(errors).length > 0 || periodeFeilmeldinger.length > 0;

    function fjernPeriode(index: number) {
        remove(index);
    }

    if (!person) return <ErrorMessage>Kunne ikke hente personinformasjon</ErrorMessage>;

    return (
        <FormProvider {...form}>
            <VStack as="form" noValidate onSubmit={form.handleSubmit(onSubmit)} gap="space-16" id="andre-ytelser-form">
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
                            <option value="">- Velg ytelse -</option>
                            {ANNEN_YTELSE_OPTIONS.map((ytelse) => (
                                <option key={ytelse} value={ytelse}>
                                    {ytelse}
                                </option>
                            ))}
                        </Select>
                    )}
                />
                <VStack gap="space-12">
                    {fields.map((field, index) => (
                        <PeriodeRad
                            key={field.id}
                            index={index}
                            antallPerioder={fields.length}
                            onRemove={() => fjernPeriode(index)}
                            sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                            aktivPeriode={aktivPeriode}
                        />
                    ))}
                    <HGrid columns={1} gap="space-8" align="start">
                        <Button
                            type="button"
                            variant="tertiary"
                            size="xsmall"
                            icon={<PlusIcon />}
                            onClick={() => append(tomPeriode)}
                            style={{ justifySelf: 'start', paddingInlineStart: 'var(--ax-space-0)' }}
                        >
                            Legg til periode
                        </Button>
                    </HGrid>
                </VStack>
                <Box maxWidth="calc(var(--ax-space-128) * 3)" paddingBlock="space-8">
                    <Controller
                        control={form.control}
                        name="notat"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label={<VisesIkkeIVedtakTag label="Notat til beslutter" />}
                                description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                size="small"
                                error={fieldState.error?.message}
                                id="notat"
                            />
                        )}
                    />
                </Box>
                {hasErrors && (
                    <VStack gap="space-4">
                        {periodeFeilmeldinger.map((feil) => (
                            <ErrorMessage key={feil} showIcon size="small">
                                {feil}
                            </ErrorMessage>
                        ))}
                        {errors.perioder?.root?.message && (
                            <ErrorMessage showIcon size="small">
                                {errors.perioder.root.message}
                            </ErrorMessage>
                        )}
                    </VStack>
                )}
                <HStack gap="space-8">
                    <Button size="small" variant="primary" type="submit" loading={isPending} disabled={isPending}>
                        {submitLabel}
                    </Button>
                    <Button size="small" variant="tertiary" type="button" disabled={isPending} onClick={onAvbryt}>
                        Avbryt
                    </Button>
                </HStack>
                {isError && (
                    <Alert variant="error" size="small">
                        {feilmelding}
                    </Alert>
                )}
            </VStack>
        </FormProvider>
    );
}

function hentPeriodeFeilmeldinger(errors: FieldErrors<AndreYtelserSkjemaInput>): string[] {
    const perioderFeil = errors.perioder;
    if (perioderFeil == undefined) return [];

    // Når det også finnes en feil på hele periodelista, gjør react-hook-form om arrayet til et objekt
    // med indeksnøkler pluss `root`. Da må vi plukke ut indeksene selv for å beholde feltfeilene.
    const perioder: (PeriodeFeil | undefined)[] = Array.isArray(perioderFeil)
        ? perioderFeil
        : Object.entries(perioderFeil)
              .filter(([nøkkel]) => /^\d+$/.test(nøkkel))
              .sort(([en], [to]) => Number(en) - Number(to))
              .map(([, feil]) => feil as PeriodeFeil);

    return perioder.flatMap((periode, index, allePerioder) =>
        [periode?.fom?.message, periode?.tom?.message, periode?.grad?.message]
            .filter((message): message is string => typeof message === 'string')
            .map((message) => (allePerioder.length > 1 ? `Periode ${index + 1}: ${message}` : message)),
    );
}
