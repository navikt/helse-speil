'use client';

import React, { ReactElement } from 'react';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';

import { Button, HStack, TextField, VStack } from '@navikt/ds-react';

import { AndreYtelserSkjemaInput } from '@/form-schemas/andreYtelserSchema';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import {
    erGyldigFomForSykefraværstilfelle,
    erGyldigTomForSykefraværstilfelle,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { ActivePeriod, DatePeriod } from '@typer/shared';

interface PeriodeRadProps {
    index: number;
    onRemove: () => void;
    sykefraværstilfelleperioder: DatePeriod[];
    aktivPeriode?: ActivePeriod | null;
}

export function PeriodeRad({
    index,
    onRemove,
    sykefraværstilfelleperioder,
    aktivPeriode,
}: PeriodeRadProps): ReactElement {
    const { control } = useFormContext<AndreYtelserSkjemaInput>();
    const fom = useWatch({ control, name: `perioder.${index}.fom` });
    const tom = useWatch({ control, name: `perioder.${index}.tom` });
    const { errors } = useFormState({
        control,
        name: [`perioder.${index}.fom`, `perioder.${index}.tom`, `perioder.${index}.grad`],
    });
    const fomError = errors.perioder?.[index]?.fom?.message;
    const tomError = errors.perioder?.[index]?.tom?.message;

    const erGyldigFom = (fom: string) => erGyldigFomForSykefraværstilfelle(fom, tom, sykefraværstilfelleperioder);
    const erGyldigTom = (tom: string) => erGyldigTomForSykefraværstilfelle(tom, fom, sykefraværstilfelleperioder);

    return (
        <VStack gap="space-8">
            <HStack gap="space-28" align="end">
                <ControlledDatePicker
                    name={`perioder.${index}.fom`}
                    label="Periode f.o.m."
                    hideLabel={index !== 0}
                    gyldigePerioder={sykefraværstilfelleperioder}
                    erGyldigDato={erGyldigFom}
                    id={`perioder.${index}.fom`}
                    error={fomError != undefined}
                    defaultMonth={aktivPeriode?.fom}
                />
                <ControlledDatePicker
                    name={`perioder.${index}.tom`}
                    label="Periode t.o.m."
                    hideLabel={index !== 0}
                    gyldigePerioder={sykefraværstilfelleperioder}
                    erGyldigDato={erGyldigTom}
                    id={`perioder.${index}.tom`}
                    defaultMonth={aktivPeriode?.tom}
                    error={tomError != undefined}
                />
                <Controller
                    control={control}
                    name={`perioder.${index}.grad`}
                    render={({ field, fieldState }) => (
                        <TextField
                            value={field.value == null ? '' : field.value.toString()}
                            onChange={(e) => {
                                const kunSiffer = e.target.value.replace(/\D/g, '');
                                field.onChange(kunSiffer === '' ? undefined : Number(kunSiffer));
                            }}
                            onBlur={field.onBlur}
                            label={index === 0 ? 'Grad' : undefined}
                            hideLabel={index !== 0}
                            size="small"
                            autoComplete="off"
                            error={fieldState.error?.message != undefined}
                            className="w-16"
                            id={`perioder.${index}.grad`}
                        />
                    )}
                />
                <Button
                    type="button"
                    variant="tertiary"
                    size="xsmall"
                    onClick={onRemove}
                    className="mr-auto mb-[3px] -ml-4"
                >
                    Slett
                </Button>
            </HStack>
        </VStack>
    );
}
