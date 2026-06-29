import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { FormProvider, useController, useForm, useWatch } from 'react-hook-form';

import { Button, DatePicker, ErrorMessage, HStack, VStack, useDatepicker } from '@navikt/ds-react';

import {
    LeggTilDagerArbeidstakerFormFields,
    LeggTilDagerSelvstendigFormFields,
    lagLeggTilDagerArbeidstakerSchema,
    lagLeggTilDagerSelvstendigSchema,
} from '@/form-schemas/leggTilDagerSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Kilde, Kildetype } from '@io/graphql';
import { GradField } from '@saksbilde/utbetaling/utbetalingstabell/GradField';
import {
    alleTypeendringer,
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { AvslattMeldingTilNavdag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT, somIsoDato } from '@utils/date';

import { DagtypeSelect } from './DagtypeSelect';

interface LeggTilDagerFormProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}

export const LeggTilDagerForm = ({ periodeFom, onSubmitPølsestrekk, erSelvstendig }: LeggTilDagerFormProps) => {
    return erSelvstendig ? (
        <LeggTilDagerSelvstendigForm periodeFom={periodeFom} onSubmitPølsestrekk={onSubmitPølsestrekk} />
    ) : (
        <LeggTilDagerArbeidstakerForm periodeFom={periodeFom} onSubmitPølsestrekk={onSubmitPølsestrekk} />
    );
};

interface LeggTilDagerArbeidstakerFormProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
}

const LeggTilDagerArbeidstakerForm = ({
    periodeFom,
    onSubmitPølsestrekk,
}: LeggTilDagerArbeidstakerFormProps): ReactElement => {
    const periodeFomMinusEnDag = dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'day');

    const form = useForm<LeggTilDagerArbeidstakerFormFields>({
        resolver: zodResolver(lagLeggTilDagerArbeidstakerSchema()),
        reValidateMode: 'onBlur',
        shouldUnregister: false,
        defaultValues: {
            dagtype: 'Syk',
            fom: periodeFomMinusEnDag.format(ISO_DATOFORMAT),
            tom: periodeFom,
            grad: 100,
        },
    });

    const errors = form.formState.errors;
    const fomError = errors.fom?.message;
    const gradError = errors.grad?.message;
    const dagtypeError = errors.dagtype?.message;
    const watchDag = useWatch({ name: 'dagtype', control: form.control });

    const handleSubmit = (values: LeggTilDagerArbeidstakerFormFields) => {
        const nyeDagerMap = new Map<string, Utbetalingstabelldag>();

        let endringFom = dayjs(values.fom, ISO_DATOFORMAT);
        while (endringFom.isBefore(dayjs(periodeFom, ISO_DATOFORMAT))) {
            nyeDagerMap.set(endringFom.format(ISO_DATOFORMAT), {
                dato: endringFom.format(ISO_DATOFORMAT),
                kilde: { type: Kildetype.Saksbehandler } as Kilde,
                dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!,
                erAGP: false,
                erVentetid: false,
                erAvvist: false,
                erForeldet: false,
                erMaksdato: false,
                grad: values?.grad,
                erNyDag: true,
            });
            endringFom = endringFom.add(1, 'day');
        }

        onSubmitPølsestrekk(nyeDagerMap);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
                <HStack gap="space-8" align="end" paddingBlock="space-0 space-8">
                    <DateField name="fom" label="Dato f.o.m." defaultMonth={periodeFomMinusEnDag.toDate()} />
                    <DateField name="tom" label="Dato t.o.m." disabled />
                    <DagtypeSelect
                        name="dagtype"
                        erSelvstendig={false}
                        overstyringsdagtyper={overstyringsdagtyperArbeidstaker}
                        hideError
                    />
                    <GradField name="grad" kanIkkeVelgeDagtype={!kanVelgeGrad(watchDag)} hideError />
                    <Button size="small" type="submit" variant="secondary" data-testid="legg-til">
                        Legg til
                    </Button>
                </HStack>
                <VStack>
                    {fomError && (
                        <ErrorMessage size="small" showIcon>
                            Dato f.o.m: {fomError}
                        </ErrorMessage>
                    )}
                    {dagtypeError && (
                        <ErrorMessage size="small" showIcon>
                            Dagtype: {dagtypeError}
                        </ErrorMessage>
                    )}
                    {gradError && (
                        <ErrorMessage size="small" showIcon>
                            Grad: {gradError}
                        </ErrorMessage>
                    )}
                </VStack>
            </form>
        </FormProvider>
    );
};

interface LeggTilDagerSelvstendigFormProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
}

const LeggTilDagerSelvstendigForm = ({
    periodeFom,
    onSubmitPølsestrekk,
}: LeggTilDagerSelvstendigFormProps): ReactElement => {
    const periodeFomMinusEnDag = dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'day');

    const form = useForm<LeggTilDagerSelvstendigFormFields>({
        resolver: zodResolver(lagLeggTilDagerSelvstendigSchema()),
        reValidateMode: 'onBlur',
        shouldUnregister: false,
        defaultValues: {
            dagtype: 'MeldingTilNav',
            fom: periodeFomMinusEnDag.format(ISO_DATOFORMAT),
            tom: periodeFom,
        },
    });

    const errors = form.formState.errors;
    const fomError = errors.fom?.message;
    const dagtypeError = errors.dagtype?.message;
    const watchDag = useWatch({ name: 'dagtype', control: form.control });

    const handleSubmit = (values: LeggTilDagerSelvstendigFormFields) => {
        const nyeDagerMap = new Map<string, Utbetalingstabelldag>();

        let endringFom = dayjs(values.fom, ISO_DATOFORMAT);
        while (endringFom.isBefore(dayjs(periodeFom, ISO_DATOFORMAT))) {
            nyeDagerMap.set(endringFom.format(ISO_DATOFORMAT), {
                dato: endringFom.format(ISO_DATOFORMAT),
                kilde: { type: Kildetype.Saksbehandler } as Kilde,
                dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!,
                erAGP: false,
                erVentetid: false,
                erAvvist: false,
                erForeldet: false,
                erMaksdato: false,
                erNyDag: true,
            });
            endringFom = endringFom.add(1, 'day');
        }

        onSubmitPølsestrekk(nyeDagerMap);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} autoComplete="off">
                <HStack gap="space-8" align="end" paddingBlock="space-0 space-8">
                    <DateField name="fom" label="Dato f.o.m." defaultMonth={periodeFomMinusEnDag.toDate()} />
                    <DateField name="tom" label="Dato t.o.m." disabled />
                    <DagtypeSelect
                        name="dagtype"
                        erSelvstendig={true}
                        overstyringsdagtyper={overstyringsdagtyperSelvstendig.filter(
                            (dag) => dag !== AvslattMeldingTilNavdag,
                        )}
                        hideError
                    />
                    <GradField name="grad" kanIkkeVelgeDagtype={!kanVelgeGrad(watchDag)} hideError />
                    <Button size="small" type="submit" variant="secondary" data-testid="legg-til">
                        Legg til
                    </Button>
                </HStack>
                <VStack>
                    {fomError && (
                        <ErrorMessage size="small" showIcon>
                            Dato f.o.m: {fomError}
                        </ErrorMessage>
                    )}
                    {dagtypeError && (
                        <ErrorMessage size="small" showIcon>
                            Dagtype: {dagtypeError}
                        </ErrorMessage>
                    )}
                </VStack>
            </form>
        </FormProvider>
    );
};

interface DateFieldProps {
    name: string;
    label: string;
    defaultMonth?: Date;
    disabled?: boolean;
    className?: string;
}

function DateField({ name, label, defaultMonth, disabled, className }: DateFieldProps): ReactElement {
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
                disabled={disabled}
                className={className}
            />
        </DatePicker>
    );
}
