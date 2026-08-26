'use client';

import React, { ReactElement } from 'react';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';

import { Button, HGrid, TextField, VStack } from '@navikt/ds-react';

import { AndreYtelserSkjemaInput } from '@/form-schemas/andreYtelserSchema';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import { DatePeriod } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag } from '@utils/date';

interface PeriodeRadProps {
    index: number;
    onRemove: () => void;
    sykefraværstilfelleperioder: DatePeriod[];
}

export function PeriodeRad({ index, onRemove, sykefraværstilfelleperioder }: PeriodeRadProps): ReactElement {
    const { control } = useFormContext<AndreYtelserSkjemaInput>();
    const fom = useWatch({ control, name: `perioder.${index}.fom` });
    const tom = useWatch({ control, name: `perioder.${index}.tom` });
    const { errors } = useFormState({
        control,
        name: [`perioder.${index}.fom`, `perioder.${index}.tom`, `perioder.${index}.grad`],
    });
    const fomError = errors.perioder?.[index]?.fom?.message;
    const tomError = errors.perioder?.[index]?.tom?.message;

    const erGyldigFom = (fom: string) => {
        if (!erGyldigNorskDato(fom)) return false;
        const isoDato = norskDatoTilIsoDato(fom);
        return (
            sykefraværstilfelleperioder.some((periode) => erIPeriode(isoDato, periode)) &&
            (!erGyldigNorskDato(tom) || isoDato <= norskDatoTilIsoDato(tom))
        );
    };

    const erGyldigTom = (tom: string) => {
        if (!erGyldigNorskDato(tom)) return false;
        const isoDato = norskDatoTilIsoDato(tom);
        return (
            sykefraværstilfelleperioder.some((periode) =>
                erIPeriode(isoDato, { fom: plussEnDag(periode.fom), tom: periode.tom }),
            ) &&
            (!erGyldigNorskDato(fom) || isoDato >= norskDatoTilIsoDato(fom))
        );
    };

    return (
        <VStack gap="space-8" marginBlock="space-16">
            <HGrid columns={4} gap="space-8" align="end">
                <ControlledDatePicker
                    name={`perioder.${index}.fom`}
                    label="Periode f.o.m."
                    hideLabel={index !== 0}
                    gyldigePerioder={sykefraværstilfelleperioder}
                    erGyldigDato={erGyldigFom}
                    id={`perioder.${index}.fom`}
                    error={fomError != undefined}
                />
                <ControlledDatePicker
                    name={`perioder.${index}.tom`}
                    label="Periode t.o.m."
                    hideLabel={index !== 0}
                    gyldigePerioder={sykefraværstilfelleperioder}
                    erGyldigDato={erGyldigTom}
                    id={`perioder.${index}.tom`}
                    defaultMonth={fom === '' ? undefined : fom}
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
                            style={{ width: 'var(--ax-space-80)' }}
                            id={`perioder.${index}.grad`}
                        />
                    )}
                />
                <Button type="button" variant="tertiary" size="xsmall" onClick={onRemove}>
                    Slett
                </Button>
            </HGrid>
        </VStack>
    );
}
