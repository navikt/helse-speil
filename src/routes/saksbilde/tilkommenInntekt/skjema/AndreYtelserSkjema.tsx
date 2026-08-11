import {useRouter} from 'next/navigation';
import React, {ReactElement, useState} from 'react';
import {Controller, FormProvider, useFieldArray, useForm, UseFormReturn, useWatch} from 'react-hook-form';

import {PlusIcon, TrashIcon} from '@navikt/aksel-icons';
import {Button, ErrorMessage, HGrid, HStack, Select, Textarea, TextField, VStack} from '@navikt/ds-react';
import {Box} from '@navikt/ds-react/Box';

import {AndreYtelserSchema, ANNEN_YTELSE_OPTIONS, lagAndreYtelserSchema} from '@/form-schemas/andreYtelserSchema';
import {zodResolver} from '@hookform/resolvers/zod';
import {ControlledDatePicker} from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import {utledSykefraværstilfelleperioder} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import {useFetchPersonQuery} from '@state/person';
import {erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag} from '@utils/date';

interface PeriodeRadProps {
    index: number;
    form: UseFormReturn<AndreYtelserSchema>;
    onRemove: () => void;
    canRemove: boolean;
    sykefraværstilfelleperioder: ReturnType<typeof utledSykefraværstilfelleperioder>;
}

const PeriodeRad = ({ index, form, onRemove, canRemove, sykefraværstilfelleperioder }: PeriodeRadProps): ReactElement => {
    const fom = useWatch({ control: form.control, name: `perioder.${index}.fom` });
    const tom = useWatch({ control: form.control, name: `perioder.${index}.tom` });
    const fomError = form.formState.errors.perioder?.[index]?.fom?.message;
    const tomError = form.formState.errors.perioder?.[index]?.tom?.message;
    const gradError = form.formState.errors.perioder?.[index]?.grad?.message;

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
        <HGrid columns="1fr 1fr auto auto" gap="space-8" align="end">
            <ControlledDatePicker
                name={`perioder.${index}.fom`}
                label="Periode f.o.m."
                hideLabel={index !== 0}
                gyldigePerioder={sykefraværstilfelleperioder}
                erGyldigDato={erGyldigFom}
                id={`perioder.${index}.fom`}
                error
            />
            <ControlledDatePicker
                name={`perioder.${index}.tom`}
                label="Periode t.o.m."
                hideLabel={index !== 0}
                gyldigePerioder={sykefraværstilfelleperioder}
                erGyldigDato={erGyldigTom}
                id={`perioder.${index}.tom`}
                defaultMonth={fom === '' ? undefined : fom}
                error
            />
            <Controller
                control={form.control}
                name={`perioder.${index}.grad`}
                render={({ field }) => (
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

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'perioder' });

    if (!person) return null;

    const handleSubmit = async (_values: AndreYtelserSchema) => {
        setSubmitError(undefined);
        setSubmitError('Lagring av andre ytelser er ikke koblet opp ennå.');
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <VStack gap="space-16">
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
                    <VStack gap="space-4">
                        {fields.map((field, index) => (
                            <PeriodeRad
                                key={field.id}
                                index={index}
                                form={form}
                                onRemove={() => remove(index)}
                                canRemove={fields.length > 1}
                                sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="tertiary"
                            size="small"
                            icon={<PlusIcon />}
                            onClick={() => append({ fom: '', tom: '', grad: undefined })}
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
                                router.back();
                            }}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </VStack>
                {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
            </form>
        </FormProvider>
    );
};
