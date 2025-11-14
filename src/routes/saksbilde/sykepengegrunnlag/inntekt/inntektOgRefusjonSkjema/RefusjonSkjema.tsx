import React, { ReactElement } from 'react';
import { FieldError, FieldErrorsImpl, Merge, useController, useFieldArray, useFormContext } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import {
    BodyShort,
    Box,
    Button,
    DatePicker,
    ErrorMessage,
    HStack,
    Label,
    VStack,
    useDatepicker,
} from '@navikt/ds-react';

import { InntektOgRefusjonSchema, RefusjonsperiodeSchema } from '@/form-schemas/inntektOgRefusjonSkjema';
import { Kildetype } from '@io/graphql';
import { RefusjonKilde } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/RefusjonKilde';
import { BeløpFelt } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/månedsbeløp/Månedsbeløp';
import { DateString } from '@typer/shared';
import { somDate, somIsoDato } from '@utils/date';

interface RefusjonSkjemaProps {
    inntektFom: DateString | null;
    inntektTom: DateString | null;
}

export function RefusjonSkjema({ inntektFom, inntektTom }: RefusjonSkjemaProps) {
    const { control, formState } = useFormContext<InntektOgRefusjonSchema>();
    const { fields, remove, append } = useFieldArray({
        name: 'refusjonsperioder',
        control,
    });

    return (
        <VStack align="start" gap="2">
            <Label size="small">Refusjon</Label>
            <VStack gap="1">
                <Box borderWidth="0 0 1 0" borderColor="border-default" marginBlock="0 2">
                    <HStack gap="8">
                        <BodyShort weight="semibold" size="small">
                            Fra og med dato
                        </BodyShort>
                        <BodyShort weight="semibold" size="small">
                            Til og med dato
                        </BodyShort>
                        <BodyShort weight="semibold" size="small" style={{ whiteSpace: 'nowrap' }}>
                            Månedlig refusjon
                        </BodyShort>
                    </HStack>
                </Box>
                <VStack gap="3">
                    {fields.map((field, index) => {
                        const fieldError = formState.errors.refusjonsperioder?.[`${index}`];
                        return (
                            <VStack key={field.id} gap="1" data-testid="refusjonsperiode">
                                <HStack gap="2" wrap={false}>
                                    <DateField
                                        name={`refusjonsperioder.${index}.fom`}
                                        label="Fra og med dato"
                                        defaultMonth={somDate(inntektFom ?? undefined)}
                                    />
                                    <DateField
                                        name={`refusjonsperioder.${index}.tom`}
                                        label="Til og med dato"
                                        defaultMonth={somDate(inntektTom ?? undefined)}
                                    />
                                    <BeløpFelt name={`refusjonsperioder.${index}.beløp`} label="Månedlig refusjon" />
                                    <RefusjonKilde kilde={field.kilde as Kildetype} />
                                    <Button
                                        type="button"
                                        onClick={() => remove(index)}
                                        variant="tertiary"
                                        size="xsmall"
                                    >
                                        Slett
                                    </Button>
                                </HStack>
                                <RefusjonFeiloppsummering error={fieldError} />
                            </VStack>
                        );
                    })}
                </VStack>
            </VStack>
            <Button
                type="button"
                onClick={() => {
                    append({
                        fom: '',
                        tom: '',
                        beløp: 0,
                        kilde: Kildetype.Saksbehandler,
                    });
                }}
                icon={<PlusIcon />}
                variant="tertiary"
                size="xsmall"
            >
                Legg til
            </Button>
        </VStack>
    );
}

interface FeiloppsummeringProps {
    error: Merge<FieldError, FieldErrorsImpl<RefusjonsperiodeSchema>> | undefined;
}

const RefusjonFeiloppsummering = ({ error }: FeiloppsummeringProps): ReactElement | null =>
    error != null ? (
        <>
            {error?.fom && (
                <ErrorMessage size="small" showIcon>
                    {error.fom.message}
                </ErrorMessage>
            )}
            {error?.tom && (
                <ErrorMessage size="small" showIcon>
                    {error.tom.message}
                </ErrorMessage>
            )}
            {error?.beløp && (
                <ErrorMessage size="small" showIcon>
                    {error.beløp.message}
                </ErrorMessage>
            )}
        </>
    ) : null;

interface DateFieldProps {
    name: string;
    label: string;
    defaultMonth?: Date;
}

const DateField = ({ name, label, defaultMonth }: DateFieldProps): ReactElement => {
    const { field, fieldState } = useController({ name });

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value,
        defaultMonth: defaultMonth ?? field.value,
        onDateChange: (date) => {
            if (!date) {
                field.onChange(null);
            } else {
                field.onChange(somIsoDato(date));
            }
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                id={name.replaceAll('.', '-')}
                size="small"
                label={label}
                onBlur={field.onBlur}
                error={fieldState.error?.message != undefined}
                hideLabel
            />
        </DatePicker>
    );
};
