import dayjs, { Dayjs } from 'dayjs';
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
import {
    GhostPeriodeFragment,
    Maybe,
    type NyttInntektsforholdPeriodeFragment,
    PeriodeFragment,
    PersonFragment,
    TilkommenInntektskilde,
} from '@io/graphql';
import { TilkommenTable } from '@saksbilde/tilkommenInntekt/TilkommenTable';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT, erGyldigDato, erHelg } from '@utils/date';

interface TilkommenInntektContainerProps {
    form: ReturnType<typeof useForm<TilkommenInntektSchema>>;
    dagerTilFordeling: number;
    defaultFom: Date;
    defaultTom: Date;
}

const TilkommenInntektContainer = ({
    form,
    dagerTilFordeling,
    defaultFom,
    defaultTom,
}: TilkommenInntektContainerProps): Maybe<ReactElement> => {
    const onSubmit = async (values: TilkommenInntektSchema) => {
        console.log(values);
    };

    const inntektPerDag = form.watch('periodebeløp') / dagerTilFordeling;

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
                                        defaultMonth={defaultFom}
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
                                        defaultMonth={defaultTom}
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

interface TilkommenInntektSkjemaProps {
    person: PersonFragment;
    periode: PeriodeFragment | GhostPeriodeFragment | NyttInntektsforholdPeriodeFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
}

export const TilkommenInntektSkjema = ({
    person,
    periode,
    tilkommeneInntektskilder,
}: TilkommenInntektSkjemaProps): ReactElement => {
    const [dagerSomSkalEkskluderes, setdagerSomSkalEkskluderes] = React.useState<DateString[]>([]);

    const defaultFom = dayjs(periode.fom).toDate();
    const defaultTom = dayjs(periode.tom).toDate();

    const vedtaksperioder = person.arbeidsgivere
        .flatMap((ag) => ag.generasjoner[0]?.perioder)
        .filter((periode) => periode != null)
        .map((periode) => ({
            fom: periode.fom,
            tom: periode.tom,
            skjæringstidspunkt: periode.skjaeringstidspunkt,
        }));

    const sykefraværstilfeller = Object.values(
        vedtaksperioder.reduce(
            (acc, periode) => {
                const key = periode.skjæringstidspunkt;
                if (!acc[key]) {
                    acc[key] = { ...periode };
                } else {
                    acc[key].fom = acc[key].fom < periode.fom ? acc[key].fom : periode.fom;
                    acc[key].tom = acc[key].tom > periode.tom ? acc[key].tom : periode.tom;
                }
                return acc;
            },
            {} as Record<string, { fom: string; tom: string; skjæringstidspunkt: string }>,
        ),
    );

    const eksisterendePerioder = new Map<string, { fom: string; tom: string }[]>();

    tilkommeneInntektskilder.forEach((inntektskilde) =>
        eksisterendePerioder.set(
            inntektskilde.organisasjonsnummer,
            inntektskilde.inntekter.map((inntekt) => ({
                fom: inntekt.periode.fom,
                tom: inntekt.periode.tom,
            })),
        ),
    );

    const form = useForm<TilkommenInntektSchema>({
        resolver: zodResolver(lagTilkommenInntektSchema(sykefraværstilfeller, eksisterendePerioder)),
        defaultValues: {
            organisasjonsnummer: '',
            fom: '',
            tom: '',
            periodebeløp: 0,
            notat: '',
        },
    });

    const fom = form.watch('fom');
    const tom = form.watch('tom');

    const datoIntervall: Dayjs[] = [];
    let gjeldendeDag = dayjs(fom);

    while (gjeldendeDag.isSameOrBefore(dayjs(tom))) {
        datoIntervall.push(gjeldendeDag);
        gjeldendeDag = gjeldendeDag.add(1, 'day');
    }

    const dagerTilGradering = filtrerDager(datoIntervall, dagerSomSkalEkskluderes);

    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <div>{dagerTilGradering.map((day) => day.format(ISO_DATOFORMAT) + ', ')}</div>
            <div>{dagerSomSkalEkskluderes.map((day) => day + ', ')}</div>
            <HStack>
                <TilkommenInntektContainer
                    form={form}
                    dagerTilFordeling={dagerTilGradering.length}
                    defaultFom={defaultFom}
                    defaultTom={defaultTom}
                />
                {erGyldigDato(fom) && erGyldigDato(tom) && (
                    <TilkommenTable
                        arbeidsgivere={person.arbeidsgivere}
                        fom={fom}
                        tom={tom}
                        setDagerSomSkalEkskluderes={setdagerSomSkalEkskluderes}
                    />
                )}
            </HStack>
        </ErrorBoundary>
    );
};

type ControlledDatePickerProps = {
    field: ControllerRenderProps<TilkommenInntektSchema>;
    error?: string;
    label: string;
    defaultMonth: Date;
};

export const ControlledDatePicker = ({ field, error, label, defaultMonth }: ControlledDatePickerProps) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultMonth: defaultMonth,
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

const filtrerDager = (datoIntervall: Dayjs[], dagerSomSkalEkskluderes: DateString[]) =>
    datoIntervall
        .filter((dag) => !erHelg(dag.format(ISO_DATOFORMAT)))
        .filter((dag) => !(dag.format(ISO_DATOFORMAT) in dagerSomSkalEkskluderes));
