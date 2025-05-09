import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form';

import {
    BodyShort,
    Box,
    Button,
    ErrorMessage,
    ErrorSummary,
    HStack,
    Heading,
    TextField,
    Textarea,
    VStack,
} from '@navikt/ds-react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { Maybe } from '@io/graphql';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/ControlledDatePicker';

interface TilkommenInntektSkjemaProps {
    form: ReturnType<typeof useForm<TilkommenInntektSchema>>;
    handleSubmit: (values: TilkommenInntektSchema) => Promise<void>;
    dagerTilFordeling: number;
    organisasjonsnavn?: string;
    loading: boolean;
}

export const TilkommenInntektSkjemafelter = ({
    form,
    handleSubmit,
    dagerTilFordeling,
    organisasjonsnavn,
    loading,
}: TilkommenInntektSkjemaProps): Maybe<ReactElement> => {
    const router = useRouter();

    const inntektPerDag = form.watch('periodebeløp') / dagerTilFordeling;

    const datofeil: string[] = [form.formState.errors.fom?.message, form.formState.errors.tom?.message].filter(
        (feil) => feil !== undefined,
    );

    const organisasjonsnummerFeil = form.formState.errors.organisasjonsnummer?.message;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <VStack paddingBlock="8 6" paddingInline="2 0">
                    <Heading level="2" size="small" spacing>
                        Legg til tilkommen inntekt
                    </Heading>
                    <Box
                        background={'surface-subtle'}
                        borderWidth="0 0 0 3"
                        style={{ borderColor: 'transparent' }}
                        paddingBlock="4"
                        paddingInline={'10'}
                        minWidth={'390px'}
                        maxWidth={'630px'}
                    >
                        <VStack marginBlock="4 4" gap="2">
                            <HStack align="end" gap="3">
                                <Controller
                                    control={form.control}
                                    name="organisasjonsnummer"
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            style={{ width: '140px' }}
                                            error={fieldState.error?.message != undefined}
                                            label="Organisasjonsnummer"
                                            size="small"
                                            type="text"
                                            inputMode="numeric"
                                            id="organisasjonsnummer"
                                        />
                                    )}
                                />
                                <BodyShort style={{ marginBottom: 'var(--a-spacing-1)' }}>
                                    {organisasjonsnavn}
                                </BodyShort>
                            </HStack>
                            {organisasjonsnummerFeil != undefined && (
                                <HStack align="center" gap="1">
                                    <ErrorMessage showIcon size="small">
                                        {organisasjonsnummerFeil}
                                    </ErrorMessage>
                                </HStack>
                            )}
                        </VStack>
                        <VStack marginBlock="4 4" gap="2">
                            <HStack wrap={false} gap="6">
                                <Controller
                                    name="fom"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <ControlledDatePicker
                                            field={field}
                                            label="Periode f.o.m"
                                            error={fieldState.error?.message}
                                            defaultMonth={new Date()}
                                            id="fom"
                                        />
                                    )}
                                />
                                <Controller
                                    name="tom"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <ControlledDatePicker
                                            field={field}
                                            label="Periode t.o.m"
                                            error={fieldState.error?.message}
                                            defaultMonth={new Date()}
                                            id="tom"
                                        />
                                    )}
                                />
                            </HStack>
                            {datofeil.length > 0 &&
                                datofeil.map((feil) => (
                                    <ErrorMessage key={feil} showIcon size="small">
                                        {feil}
                                    </ErrorMessage>
                                ))}
                        </VStack>
                        <HStack wrap gap="6" marginBlock="4 4">
                            <Controller
                                control={form.control}
                                name="periodebeløp"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Inntekt for perioden"
                                        size="small"
                                        style={{ width: 'var(--a-spacing-24)' }}
                                        id="periodebeløp"
                                        onFocus={(e) => e.target.select()}
                                    />
                                )}
                            />
                            <TextField
                                label="Inntekt per dag"
                                size="small"
                                readOnly
                                style={{ width: 'var(--a-spacing-24)' }}
                                value={
                                    Number.isNaN(inntektPerDag) || !Number.isFinite(inntektPerDag)
                                        ? ''
                                        : Number.isSafeInteger(inntektPerDag)
                                          ? inntektPerDag
                                          : inntektPerDag.toFixed(1)
                                }
                            />
                        </HStack>
                        <Box maxWidth="380px">
                            <Controller
                                control={form.control}
                                name="notat"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Notat til beslutter"
                                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                        size="small"
                                        id="notat"
                                    />
                                )}
                            />
                        </Box>
                        {Object.values(form.formState.errors).length > 0 && (
                            <Box marginBlock="4 6">
                                <TilkommenInntektFeiloppsummering errors={form.formState.errors} />
                            </Box>
                        )}
                        <HStack gap="2" marginBlock="4 4">
                            <Button size="small" variant="secondary" type="submit" loading={loading}>
                                Lagre
                            </Button>
                            <Button
                                size="small"
                                variant="tertiary"
                                type="button"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Avbryt
                            </Button>
                        </HStack>
                    </Box>
                </VStack>
            </form>
        </FormProvider>
    );
};

interface TilkommenInntektFeiloppsummeringProps {
    errors: FieldErrors<TilkommenInntektSchema>;
}

const TilkommenInntektFeiloppsummering = ({ errors }: TilkommenInntektFeiloppsummeringProps) => (
    <ErrorSummary size="small">
        {errors.organisasjonsnummer?.message && (
            <ErrorSummary.Item href="#organisasjonsnummer">{errors.organisasjonsnummer?.message}</ErrorSummary.Item>
        )}
        {errors.fom?.message && <ErrorSummary.Item href="#fom">{errors.fom?.message}</ErrorSummary.Item>}
        {errors.tom?.message && <ErrorSummary.Item href="#tom">{errors.tom?.message}</ErrorSummary.Item>}
        {errors.periodebeløp?.message && (
            <ErrorSummary.Item href="#periodebeløp">{errors.periodebeløp?.message}</ErrorSummary.Item>
        )}
        {errors.notat?.message && <ErrorSummary.Item href="#notat">{errors.notat?.message}</ErrorSummary.Item>}
    </ErrorSummary>
);
