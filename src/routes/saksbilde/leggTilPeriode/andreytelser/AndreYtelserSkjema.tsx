/* eslint-disable */
import { useRouter } from 'next/navigation';
import React, { ReactElement, useCallback, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Alert, Box, Button, ErrorMessage, HGrid, HStack, Select, Textarea, VStack } from '@navikt/ds-react';

import { AndreYtelserFormFields, lagAndreYtelserSchema } from '@/form-schemas/andreYtelserSkjema';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonFragment } from '@io/graphql';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import { utledSykefraværstilfelleperioder } from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { GradField } from '@saksbilde/utbetaling/utbetalingstabell/GradField';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag, somNorskDato } from '@utils/date';

interface AndreYtelserSkjemaProps {
    person: PersonFragment;
}

export const AndreYtelserSkjema = ({ person }: AndreYtelserSkjemaProps): ReactElement => {
    const router = useRouter();
    const [isSubmitting] = useState<boolean>(false);
    const [submitError] = useState<string | undefined>(undefined);

    const startFom = '';
    const startTom = '';
    const sykefraværstilfelleperioder = utledSykefraværstilfelleperioder(person);
    const form = useForm<AndreYtelserFormFields>({
        resolver: zodResolver(lagAndreYtelserSchema(sykefraværstilfelleperioder)),
        reValidateMode: 'onBlur',
        defaultValues: {
            ytelse: '',
            fom: somNorskDato(startFom) ?? '',
            tom: somNorskDato(startTom) ?? '',
            grad: undefined,
            notat: '',
        },
    });

    const errors = form.formState.errors;
    const fomError = errors.fom?.message;
    const tomError = errors.tom?.message;
    const gradError = errors.grad?.message;

    const fom = useWatch({ name: 'fom', control: form.control });
    const tom = useWatch({ name: 'tom', control: form.control });

    const erGyldigFom = useCallback(
        (fom: string) => {
            if (!erGyldigNorskDato(fom)) return false;
            const isoDato = norskDatoTilIsoDato(fom);
            return (
                sykefraværstilfelleperioder.some((periode) => erIPeriode(isoDato, periode)) &&
                (!erGyldigNorskDato(tom) || isoDato <= norskDatoTilIsoDato(tom))
            );
        },
        [tom, sykefraværstilfelleperioder],
    );

    const erGyldigTom = useCallback(
        (tom: string) => {
            if (!erGyldigNorskDato(tom)) return false;
            const isoDato = norskDatoTilIsoDato(tom);
            return (
                sykefraværstilfelleperioder.some((periode) =>
                    erIPeriode(isoDato, { fom: plussEnDag(periode.fom), tom: periode.tom }),
                ) &&
                (!erGyldigNorskDato(fom) || isoDato >= norskDatoTilIsoDato(fom))
            );
        },
        [fom, sykefraværstilfelleperioder],
    );

    const handleSubmit = (values: AndreYtelserFormFields) => {
        console.log('Mock submit OK', values);
    };

    return (
        <ErrorBoundary fallback={<AndreYtelserError />}>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Box
                        background="surface-subtle"
                        paddingInline="10"
                        paddingBlock="4"
                        width="460px"
                        borderWidth="0 0 0 3"
                        borderColor="border-action"
                    >
                        <HStack wrap={false}>
                            <VStack>
                                <Controller
                                    control={form.control}
                                    name="ytelse"
                                    render={({ field, fieldState }) => (
                                        <Select
                                            {...field}
                                            error={fieldState.error?.message}
                                            label="Velg ytelse"
                                            size="small"
                                            id="ytelse"
                                            style={{ width: '275px' }}
                                        >
                                            <option value="">Velg ytelse</option>
                                            {andreYtelser.map((ytelse) => (
                                                <option key={ytelse}>{ytelse}</option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </VStack>
                        </HStack>
                        <VStack marginBlock="4" gap="2">
                            <HGrid columns={3}>
                                <ControlledDatePicker
                                    name="fom"
                                    label="Periode f.o.m"
                                    gyldigePerioder={sykefraværstilfelleperioder}
                                    erGyldigDato={erGyldigFom}
                                    id="fom"
                                    error
                                />
                                <ControlledDatePicker
                                    name="tom"
                                    label="Periode t.o.m"
                                    gyldigePerioder={sykefraværstilfelleperioder}
                                    erGyldigDato={erGyldigTom}
                                    id="tom"
                                    defaultMonth={fom === '' ? undefined : fom}
                                    error
                                />
                                <GradField name="grad" hideError />
                            </HGrid>
                            {fomError && (
                                <ErrorMessage size="small" showIcon>
                                    Dato f.o.m: {fomError}
                                </ErrorMessage>
                            )}
                            {tomError && (
                                <ErrorMessage size="small" showIcon>
                                    Dato t.o.m: {tomError}
                                </ErrorMessage>
                            )}
                            {gradError && (
                                <ErrorMessage size="small" showIcon>
                                    Grad: {gradError}
                                </ErrorMessage>
                            )}
                        </VStack>
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
                                        id="notat"
                                    />
                                )}
                            />
                        </Box>
                        <VStack>
                            <HStack gap="2" marginBlock="4">
                                <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                                    Lagre
                                </Button>
                                <Button
                                    size="small"
                                    variant="tertiary"
                                    type="button"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Avbryt
                                </Button>
                            </HStack>
                            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
                        </VStack>
                    </Box>
                </form>
            </FormProvider>
        </ErrorBoundary>
    );
};

const AndreYtelserError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise andre ytelser for denne perioden.
    </Alert>
);

export const andreYtelser = [
    'Foreldrepenger',
    'Svangerskapspenger',
    'Pleiepenger',
    'Omsorgspenger',
    'Opplæringspenger',
];

export type AndreYtelser = (typeof andreYtelser)[number];
