import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button, ErrorMessage, HGrid, HStack, TextField, Textarea, VStack } from '@navikt/ds-react';
import { Box } from '@navikt/ds-react/Box';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';
import { erGyldigOrganisasjonsnummer, useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostTilkomneInntekter } from '@io/rest/generated/tilkomne-inntekter/tilkomne-inntekter';
import { ControlledDatePicker } from '@saksbilde/tilkommenInntekt/skjema/ControlledDatePicker';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjemaTabell';
import {
    beregnInntektPerDag,
    tilPerioderPerOrganisasjonsnummer,
    utledSykefraværstilfelleperioder,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import { tilTilkomneInntekterMedOrganisasjonsnummer, useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { useTilkommenInntektFormDraft } from '@state/tilkommenInntektSkjema';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';
import { isNumber } from '@utils/typeguards';

export const LeggTilTilkommenInntektSkjema = (): ReactElement | null => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const draftKey = `ny-${personPseudoId}`;
    const { draft, setDraft, clearDraft } = useTilkommenInntektFormDraft(draftKey);

    const { data: tilkommenInntektData, refetch } = useHentTilkommenInntektQuery(personPseudoId);
    const andreTilkomneInntekter =
        tilkommenInntektData !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData)
            : undefined;

    const { mutate: leggTilTilkommenInntekt } = usePostTilkomneInntekter();

    const sykefraværstilfelleperioder = person ? utledSykefraværstilfelleperioder(person) : [];
    const eksisterendePerioder = andreTilkomneInntekter
        ? tilPerioderPerOrganisasjonsnummer(andreTilkomneInntekter)
        : new Map();

    const form = useForm({
        resolver: zodResolver(
            lagTilkommenInntektSchema(sykefraværstilfelleperioder, eksisterendePerioder, () => organisasjonEksisterer),
        ),
        reValidateMode: 'onBlur',
        defaultValues: {
            organisasjonsnummer: draft?.organisasjonsnummer ?? '',
            fom: draft?.fom ?? '',
            tom: draft?.tom ?? '',
            periodebeløp: draft?.periodebeløp ?? 0,
            notat: draft?.notat ?? '',
            ekskluderteUkedager: draft?.ekskluderteUkedager ?? [],
        },
    });

    const organisasjonsnummer = useWatch({ name: 'organisasjonsnummer', control: form.control });
    const { data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);
    const organisasjonEksisterer = organisasjonData?.navn != undefined;

    const fom = useWatch({ name: 'fom', control: form.control });
    const tom = useWatch({ name: 'tom', control: form.control });

    const erGyldigFom = (fom: string) => {
        if (!erGyldigNorskDato(fom)) return false;
        const isoDato = norskDatoTilIsoDato(fom);
        return (
            sykefraværstilfelleperioder.some((p) => erIPeriode(isoDato, p)) &&
            (!erGyldigNorskDato(tom) || isoDato <= norskDatoTilIsoDato(tom))
        );
    };

    const erGyldigTom = (tom: string) => {
        if (!erGyldigNorskDato(tom)) return false;
        const isoDato = norskDatoTilIsoDato(tom);
        return (
            sykefraværstilfelleperioder.some((p) => erIPeriode(isoDato, { fom: plussEnDag(p.fom), tom: p.tom })) &&
            (!erGyldigNorskDato(fom) || isoDato >= norskDatoTilIsoDato(fom))
        );
    };

    const [periodebeløpVisningsverdi, setPeriodebeløpVisningsverdi] = useState(toKronerOgØre(draft?.periodebeløp ?? 0));
    const periodebeløp = useWatch({ name: 'periodebeløp', control: form.control });
    const ekskluderteUkedager = useWatch({ name: 'ekskluderteUkedager', control: form.control });

    const gyldigPeriode = useMemo(
        () =>
            erGyldigFom(fom) && erGyldigTom(tom)
                ? { fom: norskDatoTilIsoDato(fom), tom: norskDatoTilIsoDato(tom) }
                : undefined,

        [erGyldigFom, erGyldigTom, fom, tom],
    );

    const inntektPerDag =
        gyldigPeriode !== undefined
            ? beregnInntektPerDag(isNumber(periodebeløp) ? periodebeløp : 0, gyldigPeriode, ekskluderteUkedager)
            : undefined;

    const { setValue } = form;
    useEffect(() => {
        if (gyldigPeriode !== undefined) {
            if (ekskluderteUkedager.some((dag) => !erIPeriode(dag, gyldigPeriode))) {
                setValue(
                    'ekskluderteUkedager',
                    ekskluderteUkedager.filter((dag) => erIPeriode(dag, gyldigPeriode)),
                );
            }
        }
    }, [gyldigPeriode, ekskluderteUkedager, setValue]);

    if (!person || andreTilkomneInntekter === undefined) return null;

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        setSubmitError(undefined);
        leggTilTilkommenInntekt(
            {
                data: {
                    fodselsnummer: person.fodselsnummer,
                    notatTilBeslutter: values.notat,
                    verdier: {
                        periode: { fom: norskDatoTilIsoDato(values.fom), tom: norskDatoTilIsoDato(values.tom) },
                        organisasjonsnummer: values.organisasjonsnummer,
                        periodebelop: values.periodebeløp.toString(),
                        ekskluderteUkedager: values.ekskluderteUkedager,
                    },
                },
            },
            {
                onSuccess: (data) => {
                    clearDraft();
                    refetch().then(() => navigerTilTilkommenInntekt(data.tilkommenInntektId));
                },
                onError: () => {
                    setSubmitError(
                        'Klarte ikke lagre ny tilkommen inntekt. Prøv igjen senere, eller kontakt en coach.',
                    );
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <FormProvider {...form}>
            <HStack wrap={false} gap="space-0">
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <VStack gap="space-8">
                        <HStack gap="space-4" align="end">
                            <Controller
                                control={form.control}
                                name="organisasjonsnummer"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        style={{ width: '90px' }}
                                        error={fieldState.error?.message != undefined}
                                        label="Organisasjonsnummer"
                                        size="small"
                                        type="text"
                                        inputMode="numeric"
                                        id="organisasjonsnummer"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setDraft({ ...form.getValues(), organisasjonsnummer: e.target.value });
                                        }}
                                    />
                                )}
                            />
                            {erGyldigOrganisasjonsnummer(organisasjonsnummer) && (
                                <div style={{ marginBottom: 'var(--ax-space-4)' }}>
                                    <Organisasjonsnavn maxWidth="225px" organisasjonsnummer={organisasjonsnummer} />
                                </div>
                            )}
                        </HStack>
                        {form.formState.errors.organisasjonsnummer?.message && (
                            <ErrorMessage showIcon size="small">
                                {form.formState.errors.organisasjonsnummer.message}
                            </ErrorMessage>
                        )}
                    </VStack>

                    <VStack marginBlock="space-16" gap="space-8">
                        <HGrid columns={2} width="75%">
                            <ControlledDatePicker
                                name="fom"
                                label="Periode f.o.m."
                                gyldigePerioder={sykefraværstilfelleperioder}
                                erGyldigDato={erGyldigFom}
                                id="fom"
                                error
                            />
                            <ControlledDatePicker
                                name="tom"
                                label="Periode t.o.m."
                                gyldigePerioder={sykefraværstilfelleperioder}
                                erGyldigDato={erGyldigTom}
                                id="tom"
                                defaultMonth={fom === '' ? undefined : fom}
                                error
                            />
                        </HGrid>
                        {[form.formState.errors.fom?.message, form.formState.errors.tom?.message]
                            .filter(Boolean)
                            .map((feil) => (
                                <ErrorMessage key={feil} showIcon size="small">
                                    {feil}
                                </ErrorMessage>
                            ))}
                    </VStack>

                    <VStack marginBlock="space-16" gap="space-8">
                        <HGrid columns={2} width="75%">
                            <Controller
                                control={form.control}
                                name="periodebeløp"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        value={periodebeløpVisningsverdi}
                                        onChange={(e) => {
                                            const val = Number(e.target.value.replaceAll(' ', '').replaceAll(',', '.'));
                                            setPeriodebeløpVisningsverdi(e.target.value);
                                            field.onChange(val);
                                        }}
                                        onBlur={(e) => {
                                            const val = Number(e.target.value.replaceAll(' ', '').replaceAll(',', '.'));
                                            setPeriodebeløpVisningsverdi(
                                                Number.isNaN(val) ? e.target.value : toKronerOgØre(val),
                                            );
                                            field.onChange(Number(val.toFixed(2)));
                                            field.onBlur();
                                        }}
                                        error={fieldState.error?.message != undefined}
                                        label="Inntekt for perioden"
                                        size="small"
                                        style={{ width: '80px' }}
                                        id="periodebeløp"
                                        onFocus={(e) => e.target.select()}
                                    />
                                )}
                            />
                            <TextField
                                label="Inntekt per dag"
                                size="small"
                                readOnly
                                style={{ width: '80px' }}
                                value={
                                    inntektPerDag === undefined ||
                                    Number.isNaN(inntektPerDag) ||
                                    !Number.isFinite(inntektPerDag)
                                        ? ''
                                        : toKronerOgØre(inntektPerDag)
                                }
                            />
                        </HGrid>
                        {form.formState.errors.periodebeløp?.message && (
                            <ErrorMessage showIcon size="small">
                                {form.formState.errors.periodebeløp.message}
                            </ErrorMessage>
                        )}
                    </VStack>

                    <Box maxWidth="380px" marginBlock="space-16">
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

                    <HStack gap="space-8" marginBlock="space-16">
                        <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                            Lagre
                        </Button>
                        <Button
                            size="small"
                            variant="tertiary"
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                                clearDraft();
                                router.back();
                            }}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                    {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
                </form>
                {gyldigPeriode !== undefined && (
                    <Controller
                        control={form.control}
                        name="ekskluderteUkedager"
                        render={({ field, fieldState }) => (
                            <TilkommenInntektSkjemaTabell
                                inntektsforhold={finnAlleInntektsforhold(person)}
                                periode={gyldigPeriode}
                                error={fieldState.error !== undefined}
                                ekskluderteUkedager={field.value ?? []}
                                setEkskluderteUkedager={(ukedager) => {
                                    field.onChange(ukedager);
                                    field.onBlur();
                                }}
                            />
                        )}
                    />
                )}
            </HStack>
        </FormProvider>
    );
};
