import React, { ReactElement } from 'react';
import { Controller, FormProvider, useWatch } from 'react-hook-form';

import { Button, ErrorMessage, HGrid, HStack, TextField, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { erGyldigOrganisasjonsnummer } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import { LeggTilTilkommenInntektSkjemaState } from '@saksbilde/tilkommenInntekt/skjema/useLeggTilTilkommenInntektSkjema';
import { kronerOgØreTilNumber, toKronerOgØre } from '@utils/locale';

export const LeggTilTilkommenInntektSkjemaFelter = ({
    skjema,
}: {
    skjema: LeggTilTilkommenInntektSkjemaState;
}): ReactElement => {
    const {
        aktivPeriode,
        sykefraværstilfelleperioder,
        erGyldigFom,
        erGyldigTom,
        inntektPerDag,
        isSubmitting,
        submitError,
        periodebeløpVisningsverdi,
        setPeriodebeløpVisningsverdi,
        handleSubmit,
        onCancel,
        setDraft,
        form,
    } = skjema;

    const organisasjonsnummer = useWatch({ name: 'organisasjonsnummer', control: form.control });

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <VStack gap="space-12">
                    <VStack gap="space-8">
                        <HStack gap="space-4" align="end">
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
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setDraft({ ...form.getValues(), organisasjonsnummer: e.target.value });
                                        }}
                                    />
                                )}
                            />
                            {erGyldigOrganisasjonsnummer(organisasjonsnummer) && (
                                <div style={{ marginBottom: 'var(--ax-space-4)' }}>
                                    <Organisasjonsnavn maxWidth="225px" organisasjonsnummer={organisasjonsnummer} />
                                </div>
                            )}
                        </HStack>
                        {form.formState.errors.organisasjonsnummer?.message && (
                            <ErrorMessage showIcon size="small">
                                {form.formState.errors.organisasjonsnummer.message}
                            </ErrorMessage>
                        )}
                    </VStack>

                    <VStack marginBlock="space-16" gap="space-8">
                        <HGrid columns={2} width="75%">
                            <ControlledDatePicker
                                name="fom"
                                label="Periode f.o.m."
                                gyldigePerioder={sykefraværstilfelleperioder}
                                erGyldigDato={erGyldigFom}
                                id="fom"
                                error
                                defaultMonth={aktivPeriode?.fom}
                            />
                            <ControlledDatePicker
                                name="tom"
                                label="Periode t.o.m."
                                gyldigePerioder={sykefraværstilfelleperioder}
                                erGyldigDato={erGyldigTom}
                                id="tom"
                                defaultMonth={aktivPeriode?.tom}
                                error
                            />
                        </HGrid>
                        {[form.formState.errors.fom?.message, form.formState.errors.tom?.message]
                            .filter(Boolean)
                            .map((feil) => (
                                <ErrorMessage key={feil} showIcon size="small">
                                    {feil}
                                </ErrorMessage>
                            ))}
                    </VStack>

                    <VStack marginBlock="space-16" gap="space-8">
                        <HGrid columns={2} width="75%">
                            <Controller
                                control={form.control}
                                name="periodebeløp"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        value={periodebeløpVisningsverdi}
                                        onChange={(e) => {
                                            const val = kronerOgØreTilNumber(e.target.value);
                                            setPeriodebeløpVisningsverdi(e.target.value);
                                            field.onChange(val);
                                        }}
                                        onBlur={(e) => {
                                            const val = kronerOgØreTilNumber(e.target.value);
                                            setPeriodebeløpVisningsverdi(
                                                Number.isNaN(val) ? e.target.value : toKronerOgØre(val),
                                            );
                                            field.onChange(Number(val.toFixed(2)));
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
                        {form.formState.errors.periodebeløp?.message && (
                            <ErrorMessage showIcon size="small">
                                {form.formState.errors.periodebeløp.message}
                            </ErrorMessage>
                        )}
                    </VStack>

                    <Box maxWidth="380px" marginBlock="space-16">
                        <Controller
                            control={form.control}
                            name="notat"
                            render={({ field, fieldState }) => (
                                <Textarea
                                    {...field}
                                    label={<VisesIkkeIVedtakTag label="Notat til beslutter" />}
                                    error={fieldState.error?.message}
                                    description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                    size="small"
                                    id="notat"
                                />
                            )}
                        />
                    </Box>

                    <HStack gap="space-8" marginBlock="space-16">
                        <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                            Lagre
                        </Button>
                        <Button
                            size="small"
                            variant="tertiary"
                            type="button"
                            disabled={isSubmitting}
                            onClick={onCancel}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                    {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
                </VStack>
            </form>
        </FormProvider>
    );
};
