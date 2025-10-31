import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { Controller, FieldErrors, FormProvider, useForm } from 'react-hook-form';

import { Box, Button, ErrorMessage, ErrorSummary, HGrid, HStack, TextField, Textarea, VStack } from '@navikt/ds-react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';
import { erGyldigOrganisasjonsnummer } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import { DatePeriod } from '@typer/shared';
import { toKronerOgØre } from '@utils/locale';

interface TilkommenInntektSkjemaProps {
    form: ReturnType<typeof useForm<TilkommenInntektSchema>>;
    handleSubmit: (values: TilkommenInntektSchema) => Promise<void>;
    submitError?: string;
    inntektPerDag?: number;
    erGyldigFom: (fom: string) => boolean;
    erGyldigTom: (tom: string) => boolean;
    sykefraværstilfelleperioder: DatePeriod[];
    isSubmitting: boolean;
    startPeriodebeløp: number;
}

const kronerOgØreTilNumber = (value: string) =>
    Number(
        value
            .replaceAll(' ', '')
            .replaceAll(',', '.')
            // Når tallet blir formattert av toKronerOgØre får det non braking space i stedet for ' '
            .replaceAll(String.fromCharCode(160), ''),
    );

export const TilkommenInntektSkjemafelter = ({
    form,
    handleSubmit,
    submitError,
    inntektPerDag,
    erGyldigFom,
    erGyldigTom,
    sykefraværstilfelleperioder,
    isSubmitting,
    startPeriodebeløp,
}: TilkommenInntektSkjemaProps): ReactElement | null => {
    const [periodebeløpVisningsverdi, setPeriodebeløpVisningsverdi] = useState<string>(
        toKronerOgØre(startPeriodebeløp),
    );
    const router = useRouter();

    const datofeil: string[] = [form.formState.errors.fom?.message, form.formState.errors.tom?.message].filter(
        (feil) => feil !== undefined,
    );
    const organisasjonsnummerFeil = form.formState.errors.organisasjonsnummer?.message;
    const periodebeløpFeil = form.formState.errors.periodebeløp?.message;

    const fom = form.watch('fom');
    const organisasjonsnummer = form.watch('organisasjonsnummer');

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Box
                    background={'surface-subtle'}
                    paddingInline="10"
                    paddingBlock="4"
                    width="460px"
                    borderWidth="0 0 0 3"
                    borderColor="border-action"
                >
                    <VStack gap="2">
                        <HStack gap="1" align="end">
                            <Controller
                                control={form.control}
                                name="organisasjonsnummer"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        style={{ width: '90px' }}
                                        error={fieldState.error?.message != undefined}
                                        label="Organisasjonsnummer"
                                        size="small"
                                        type="text"
                                        inputMode="numeric"
                                        id="organisasjonsnummer"
                                    />
                                )}
                            />
                            {erGyldigOrganisasjonsnummer(organisasjonsnummer) && (
                                <div style={{ marginBottom: 'var(--a-spacing-1)' }}>
                                    <Organisasjonsnavn organisasjonsnummer={organisasjonsnummer} />
                                </div>
                            )}
                        </HStack>
                        {organisasjonsnummerFeil != undefined && (
                            <HStack align="center" gap="1">
                                <ErrorMessage showIcon size="small">
                                    {organisasjonsnummerFeil}
                                </ErrorMessage>
                            </HStack>
                        )}
                    </VStack>
                    <VStack marginBlock="4" gap="2">
                        <HGrid columns={2} width="75%">
                            <Controller
                                name="fom"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <ControlledDatePicker
                                        field={field}
                                        label="Periode f.o.m"
                                        error={fieldState.error?.message}
                                        gyldigePerioder={sykefraværstilfelleperioder}
                                        erGyldigDato={erGyldigFom}
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
                                        gyldigePerioder={sykefraværstilfelleperioder}
                                        erGyldigDato={erGyldigTom}
                                        id="tom"
                                        defaultMonth={fom === '' ? undefined : fom}
                                    />
                                )}
                            />
                        </HGrid>
                        {datofeil.length > 0 &&
                            datofeil.map((feil) => (
                                <ErrorMessage key={feil} showIcon size="small">
                                    {feil}
                                </ErrorMessage>
                            ))}
                    </VStack>
                    <VStack marginBlock="4" gap="2">
                        <HGrid columns={2} width="75%">
                            <Controller
                                control={form.control}
                                name="periodebeløp"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        value={periodebeløpVisningsverdi}
                                        onChange={(event) => {
                                            const nyttBeløp = kronerOgØreTilNumber(event.target.value);
                                            setPeriodebeløpVisningsverdi(event.target.value);
                                            field.onChange(nyttBeløp);
                                        }}
                                        onBlur={(event) => {
                                            const nyttBeløp = kronerOgØreTilNumber(event.target.value);
                                            setPeriodebeløpVisningsverdi(
                                                Number.isNaN(nyttBeløp) ? event.target.value : toKronerOgØre(nyttBeløp),
                                            );
                                            field.onChange(Number(nyttBeløp.toFixed(2)));
                                            field.onBlur();
                                        }}
                                        error={fieldState.error?.message != undefined}
                                        label="Inntekt for perioden"
                                        size="small"
                                        style={{ width: '80px' }}
                                        id="periodebeløp"
                                        onFocus={(e) => e.target.select()}
                                    />
                                )}
                            />
                            <TextField
                                label="Inntekt per dag"
                                size="small"
                                readOnly
                                style={{ width: '80px' }}
                                value={
                                    inntektPerDag === undefined ||
                                    Number.isNaN(inntektPerDag) ||
                                    !Number.isFinite(inntektPerDag)
                                        ? ''
                                        : toKronerOgØre(inntektPerDag)
                                }
                            />
                        </HGrid>
                        {periodebeløpFeil != undefined && (
                            <HStack align="center" gap="1">
                                <ErrorMessage showIcon size="small">
                                    {periodebeløpFeil}
                                </ErrorMessage>
                            </HStack>
                        )}
                    </VStack>
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
                    <VStack>
                        <HStack gap="2" marginBlock="4">
                            <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                                Lagre
                            </Button>
                            <Button
                                size="small"
                                variant="tertiary"
                                type="button"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                Avbryt
                            </Button>
                        </HStack>
                        {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
                    </VStack>
                </Box>
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
        {errors.ekskluderteUkedager?.message && (
            <ErrorSummary.Item href="#ekskluderteUkedager">{errors.ekskluderteUkedager?.message}</ErrorSummary.Item>
        )}
    </ErrorSummary>
);
