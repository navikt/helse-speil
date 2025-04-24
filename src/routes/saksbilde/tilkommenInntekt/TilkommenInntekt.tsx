import dayjs from 'dayjs';
import React, { ReactElement } from 'react';
import { Controller, ControllerRenderProps, FormProvider, useForm } from 'react-hook-form';

import {
    Alert,
    Box,
    Button,
    DatePicker,
    HStack,
    Heading,
    TextField,
    Textarea,
    VStack,
    useDatepicker,
} from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { zodResolver } from '@hookform/resolvers/zod';
import { Maybe } from '@io/graphql';
import { TilkommenTable } from '@saksbilde/tilkommenInntekt/TilkommenTable';
import { ISO_DATOFORMAT } from '@utils/date';

const TilkommenInntektContainer = (): Maybe<ReactElement> => {
    const vedtaksperioder = [
        {
            fom: '2020-01-01',
            tom: '2020-01-19',
            skjæringstidspunkt: '2020-01-01',
        },
    ];

    const eksisterendePerioder = new Map<string, { fom: string; tom: string }[]>();
    eksisterendePerioder.set('947064649', [
        { fom: '2020-02-01', tom: '2020-02-02' },
        { fom: '2020-03-01', tom: '2020-03-02' },
    ]);

    const form = useForm<TilkommenInntektSchema>({
        resolver: zodResolver(lagTilkommenInntektSchema(vedtaksperioder, eksisterendePerioder)),
        defaultValues: {
            organisasjonsnummer: '',
            fom: '',
            tom: '',
            periodebeløp: 0,
            notat: '',
        },
    });

    const onSubmit = (values: TilkommenInntektSchema) => {
        console.log(values);
    };

    const periodebeløp = form.watch('periodebeløp');
    const fom = form.watch('fom');
    const tom = form.watch('tom');

    const antallDager = dayjs(tom).diff(dayjs(fom), 'day') + 1; // denne må oppdateres til riktige dager

    const inntektPerDag =
        antallDager > 0 && periodebeløp && !isNaN(Number(periodebeløp))
            ? (Number(periodebeløp) / antallDager).toFixed(2)
            : '';

    console.log(form.formState.errors);

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack paddingBlock="8 6" paddingInline="2 0">
                    <Heading size="small" spacing>
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
                        <HStack>
                            <Controller
                                control={form.control}
                                name="organisasjonsnummer"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Organisasjonsnummer"
                                        size="small"
                                        type="text"
                                        inputMode="numeric"
                                    />
                                )}
                            />
                        </HStack>
                        <HStack wrap gap="6" marginBlock="4 4">
                            <Controller
                                name="fom"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <ControlledDatePicker
                                        field={field}
                                        label="Periode f.o.m"
                                        error={fieldState.error?.message}
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
                                    />
                                )}
                            />
                        </HStack>
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
                                    />
                                )}
                            />
                            <TextField
                                label="Inntekt per dag"
                                size="small"
                                readOnly
                                style={{ width: 'var(--a-spacing-24)' }}
                                value={inntektPerDag}
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
                                    />
                                )}
                            />
                        </Box>
                        <HStack gap="2" marginBlock="4 4">
                            <Button size="small" variant="secondary" type="submit">
                                Lagre
                            </Button>
                            <Button size="small" variant="tertiary" type="button">
                                Avbryt
                            </Button>
                        </HStack>
                    </Box>
                </VStack>
            </form>
        </FormProvider>
    );
};

const TilkommenInntektError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise tilkommen inntekt for denne perioden.
    </Alert>
);

export const TilkommenInntekt = (): ReactElement => (
    <ErrorBoundary fallback={<TilkommenInntektError />}>
        <HStack>
            <TilkommenInntektContainer />
            <TilkommenTable />
        </HStack>
    </ErrorBoundary>
);

type ControlledDatePickerProps = {
    field: ControllerRenderProps<TilkommenInntektSchema>;
    error?: string;
    label: string;
};

export const ControlledDatePicker = ({ field, error, label }: ControlledDatePickerProps) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value ? dayjs(field.value, ISO_DATOFORMAT).toDate() : undefined,
        onDateChange: (date) => {
            field.onChange(date ? dayjs(date).format(ISO_DATOFORMAT) : '');
        },
    });

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} label={label} error={error} size="small" name={field.name} />
        </DatePicker>
    );
};
