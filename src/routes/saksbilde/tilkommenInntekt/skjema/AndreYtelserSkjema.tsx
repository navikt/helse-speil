import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    Button,
    DatePicker,
    ErrorMessage,
    HGrid,
    HStack,
    Select,
    TextField,
    Textarea,
    VStack,
    useDatepicker,
} from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { ANNEN_YTELSE_OPTIONS, AndreYtelserSchema, andreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { dateTilNorskDato } from '@utils/date';

interface PeriodeRadProps {
    index: number;
    form: ReturnType<typeof useForm<AndreYtelserSchema>>;
    onRemove: () => void;
    canRemove: boolean;
}

const PeriodeRad = ({ index, form, onRemove, canRemove }: PeriodeRadProps): ReactElement => {
    const [gradVisningsverdi, setGradVisningsverdi] = useState<string>('');

    const { datepickerProps: fomDatepickerProps, inputProps: fomInputProps } = useDatepicker({
        onDateChange: (date) => {
            form.setValue(`perioder.${index}.fom`, date ? dateTilNorskDato(date) : '', { shouldValidate: true });
        },
    });

    const { datepickerProps: tomDatepickerProps, inputProps: tomInputProps } = useDatepicker({
        onDateChange: (date) => {
            form.setValue(`perioder.${index}.tom`, date ? dateTilNorskDato(date) : '', { shouldValidate: true });
        },
    });

    const fomError = form.formState.errors.perioder?.[index]?.fom?.message;
    const tomError = form.formState.errors.perioder?.[index]?.tom?.message;
    const gradError = form.formState.errors.perioder?.[index]?.grad?.message;

    return (
        <HGrid columns="1fr 1fr auto auto" gap="space-8" align="end">
            <DatePicker {...fomDatepickerProps} dropdownCaption>
                <DatePicker.Input
                    {...fomInputProps}
                    label={index === 0 ? 'Periode f.o.m.' : undefined}
                    hideLabel={index !== 0}
                    size="small"
                    error={fomError}
                    id={`perioder.${index}.fom`}
                    style={{ width: '110px' }}
                />
            </DatePicker>
            <DatePicker {...tomDatepickerProps} dropdownCaption>
                <DatePicker.Input
                    {...tomInputProps}
                    label={index === 0 ? 'Periode t.o.m.' : undefined}
                    hideLabel={index !== 0}
                    size="small"
                    error={tomError}
                    id={`perioder.${index}.tom`}
                    style={{ width: '110px' }}
                />
            </DatePicker>
            <Controller
                control={form.control}
                name={`perioder.${index}.grad`}
                render={({ field }) => (
                    <TextField
                        value={gradVisningsverdi}
                        onChange={(e) => {
                            setGradVisningsverdi(e.target.value);
                            field.onChange(Number(e.target.value));
                        }}
                        onBlur={field.onBlur}
                        label={index === 0 ? 'Grad' : undefined}
                        hideLabel={index !== 0}
                        size="small"
                        type="number"
                        min={1}
                        max={100}
                        error={gradError}
                        style={{ width: '70px' }}
                        id={`perioder.${index}.grad`}
                    />
                )}
            />
            {canRemove ? (
                <Button
                    type="button"
                    variant="tertiary-neutral"
                    size="small"
                    icon={<TrashIcon />}
                    onClick={onRemove}
                    aria-label="Fjern periode"
                    style={{ marginBottom: (fomError ?? tomError ?? gradError) ? '1.5rem' : undefined }}
                />
            ) : (
                <div style={{ width: '32px' }} />
            )}
        </HGrid>
    );
};

export const AndreYtelserSkjema = (): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const form = useForm<AndreYtelserSchema>({
        resolver: zodResolver(andreYtelserSchema),
        defaultValues: { ytelse: '', perioder: [{ fom: '', tom: '', grad: 0 }], notat: '' },
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'perioder' });

    const handleSubmit = async () => {
        //TODO her må vi gjøre grejor
        setIsSubmitting(true);
        setSubmitError(undefined);
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <VStack gap="space-16">
                <Controller
                    control={form.control}
                    name="ytelse"
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
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
                <VStack gap="space-4">
                    {fields.map((field, index) => (
                        <PeriodeRad
                            key={field.id}
                            index={index}
                            form={form}
                            onRemove={() => remove(index)}
                            canRemove={fields.length > 1}
                        />
                    ))}
                    <Button
                        type="button"
                        variant="tertiary"
                        size="small"
                        icon={<PlusIcon />}
                        onClick={() => append({ fom: '', tom: '', grad: 0 })}
                    >
                        Legg til periode
                    </Button>
                </VStack>
                <Box maxWidth="380px">
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
                            //                            clearDraft();
                            router.back();
                        }}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </VStack>
            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
        </form>
    );
};
