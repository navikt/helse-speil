import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { FormProvider, useController, useForm, useFormContext } from 'react-hook-form';

import { Button, DatePicker, HStack, TextField, useDatepicker } from '@navikt/ds-react';

import { LeggTilDagerFormFields, LeggTilDagerSchema } from '@/form-schemas/leggTilDagerSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Kilde, Kildetype } from '@io/graphql';
import { alleTypeendringer } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { ISO_DATOFORMAT, somIsoDato } from '@utils/date';

import { DagtypeSelect } from './DagtypeSelectOld';

interface LeggTilDagerProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}

export const LeggTilDagerForm = React.memo(
    ({ periodeFom, onSubmitPølsestrekk, erSelvstendig }: LeggTilDagerProps): ReactElement => {
        const periodeFomMinusEnDag = dayjs(periodeFom, ISO_DATOFORMAT).subtract(1, 'day');

        const form = useForm<LeggTilDagerFormFields>({
            resolver: zodResolver(LeggTilDagerSchema),
            reValidateMode: 'onBlur',
            defaultValues: {
                dag: 'Syk',
                fom: periodeFomMinusEnDag.format(ISO_DATOFORMAT),
                tom: periodeFom,
                grad: 100,
            },
        });

        const handleSubmit = (values: LeggTilDagerFormFields) => {
            const nyeDagerMap = new Map<string, Utbetalingstabelldag>();

            let endringFom = dayjs(values.fom, ISO_DATOFORMAT);
            while (endringFom.isBefore(dayjs(periodeFom, ISO_DATOFORMAT))) {
                nyeDagerMap.set(endringFom.format(ISO_DATOFORMAT), {
                    dato: endringFom.format(ISO_DATOFORMAT),
                    kilde: { type: Kildetype.Saksbehandler } as Kilde,
                    dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dag)!!,
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
                    <HStack gap="2" marginInline="3 0" marginBlock="2 0" align="start">
                        <HStack marginBlock="1 0" gap="2">
                            <DateField name={'fom'} label="Dato f.o.m." defaultMonth={periodeFomMinusEnDag.toDate()} />
                            <DateField name={'tom'} label="Dato t.o.m." disabled />
                        </HStack>
                        <DagtypeSelect erSelvstendig={erSelvstendig} control={form.control} />
                        <HStack marginBlock="1 0">
                            <GradField />
                        </HStack>

                        <HStack marginBlock="8 0">
                            <Button size="small" type="submit" variant="secondary" data-testid="legg-til">
                                Legg til
                            </Button>
                        </HStack>
                    </HStack>
                </form>
            </FormProvider>
        );
    },
);

function GradField(): ReactElement {
    const form = useFormContext();
    const watchDag = form.watch('dag');
    const { field, fieldState } = useController({
        control: form.control,
        name: 'grad',
    });

    const [display, setDisplay] = React.useState(field.value == null ? '' : field.value);

    if (!kanVelgeGrad(watchDag)) {
        field.value = '';
    }

    const commit = () => {
        const parsed = Number.parseInt(display);
        field.onChange(isNaN(parsed) ? null : parsed);
        return parsed;
    };

    return (
        <TextField
            size="small"
            inputMode="numeric"
            label="Grad"
            htmlSize={8}
            disabled={!kanVelgeGrad(watchDag)}
            data-testid="gradvelger"
            error={fieldState.error?.message}
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            onBlur={() => {
                const parsed = commit();
                if (display !== '') {
                    setDisplay(isNaN(parsed) ? display : parsed);
                }
                field.onBlur();
            }}
            onMouseDown={(e) => {
                if (document.activeElement !== e.target) {
                    e.preventDefault();
                    (e.target as HTMLInputElement).select();
                }
            }}
        />
    );
}

interface DateFieldProps {
    name: string;
    label: string;
    defaultMonth?: Date;
    disabled?: boolean;
}

function DateField({ name, label, defaultMonth, disabled }: DateFieldProps): ReactElement {
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
            />
        </DatePicker>
    );
}
