import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { Controller, FieldErrors, FormProvider, UseFormReturn, useFieldArray, useForm, useFormState, useWatch } from 'react-hook-form';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, HGrid, HStack, Select, TextField, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { ANNEN_YTELSE_OPTIONS, AndreYtelserSchema, lagAndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import { utledSykefraværstilfelleperioder } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useFetchPersonQuery } from '@state/person';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag } from '@utils/date';

interface PeriodeRadProps {
    index: number;
    form: UseFormReturn<AndreYtelserSchema>;
    onRemove: () => void;
    sykefraværstilfelleperioder: ReturnType<typeof utledSykefraværstilfelleperioder>;
}

const tomPeriode = { fom: '', tom: '', grad: undefined };

const hentPeriodeFeilmeldinger = (errors: FieldErrors<AndreYtelserSchema>) => {
    const perioder = Array.isArray(errors.perioder) ? errors.perioder : [];

    return perioder.flatMap((periode, index, allePerioder) =>
        [periode?.fom?.message, periode?.tom?.message, periode?.grad?.message]
            .filter((message): message is string => typeof message === 'string')
            .map((message) => (allePerioder.length > 1 ? `Periode ${index + 1}: ${message}` : message)),
    );
};

const PeriodeRad = ({ index, form, onRemove, sykefraværstilfelleperioder }: PeriodeRadProps): ReactElement => {
    const fom = useWatch({ control: form.control, name: `perioder.${index}.fom` });
    const tom = useWatch({ control: form.control, name: `perioder.${index}.tom` });
    const { errors } = useFormState({
        control: form.control,
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
                    control={form.control}
                    name={`perioder.${index}.grad`}
                    render={({ field, fieldState }) => (
                        <TextField
                            value={field.value == null ? '' : field.value.toString()}
                            onChange={(e) => {
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            }}
                            onBlur={field.onBlur}
                            label={index === 0 ? 'Grad' : undefined}
                            hideLabel={index !== 0}
                            size="small"
                            type="number"
                            min={1}
                            max={99}
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
};

export const AndreYtelserSkjema = (): ReactElement => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const [isSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const sykefraværstilfelleperioder = person ? utledSykefraværstilfelleperioder(person) : [];
    const form = useForm<AndreYtelserSchema>({
        resolver: zodResolver(lagAndreYtelserSchema(sykefraværstilfelleperioder)),
        reValidateMode: 'onBlur',
        defaultValues: { ytelse: undefined, perioder: [{ fom: '', tom: '', grad: undefined }], notat: '' },
    });
    const { errors } = useFormState({ control: form.control });
    const periodeFeilmeldinger = hentPeriodeFeilmeldinger(errors);

    const { fields, append, remove, update } = useFieldArray({ control: form.control, name: 'perioder' });

    if (!person) return <ErrorMessage>Kunne ikke hente personinformasjon</ErrorMessage>;

    const handleSubmit = async (_values: AndreYtelserSchema) => {
        setSubmitError(undefined);
        setSubmitError('Lagring av andre ytelser er ikke koblet opp ennå.');
    };

    const handleRemove = (index: number) => {
        if (fields.length === 1) {
            update(index, tomPeriode);
            form.clearErrors(`perioder.${index}`);
            return;
        }

        remove(index);
    };

    return (
        <FormProvider {...form}>
            <HStack gap="space-0" wrap={false}>
                <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
                    <VStack gap="space-8">
                        <HStack gap="space-4" align="end">
                            <Controller
                                control={form.control}
                                name="ytelse"
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        value={field.value ?? ''}
                                        label="Velg ytelse"
                                        size="small"
                                        error={fieldState.error?.message}
                                        style={{ maxWidth: '220px' }}
                                    >
                                        <option value="" />
                                        {ANNEN_YTELSE_OPTIONS.map((ytelse) => (
                                            <option key={ytelse} value={ytelse}>
                                                {ytelse}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </HStack>
                        <VStack>
                            {fields.map((field, index) => (
                                <PeriodeRad
                                    key={field.id}
                                    index={index}
                                    form={form}
                                    onRemove={() => handleRemove(index)}
                                    sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                                />
                            ))}
                            <HGrid columns={1} gap="space-8" align="start">
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    size="small"
                                    icon={<PlusIcon />}
                                    onClick={() => append(tomPeriode)}
                                    style={{ justifySelf: 'start', paddingInlineStart: 'var(--ax-space-0)' }}
                                >
                                    Legg til periode
                                </Button>
                                <div />
                                <div />
                            </HGrid>
                        </VStack>
                        <Box maxWidth="calc(var(--ax-space-128) * 3)">
                            <Controller
                                control={form.control}
                                name="notat"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        label="Notat til beslutter"
                                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                        size="small"
                                        error={fieldState.error?.message}
                                        id="notat"
                                    />
                                )}
                            />
                        </Box>
                        <VStack gap="space-4">
                            {periodeFeilmeldinger.map((feil) => (
                                <ErrorMessage key={feil} showIcon size="small">
                                    {feil}
                                </ErrorMessage>
                            ))}
                        </VStack>
                        <HStack gap="space-8">
                            <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                                Lagre
                            </Button>
                            <Button
                                size="small"
                                variant="tertiary"
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => {
                                    router.back();
                                }}
                            >
                                Avbryt
                            </Button>
                        </HStack>
                    </VStack>
                    {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
                </form>
            </HStack>
        </FormProvider>
    );
};
