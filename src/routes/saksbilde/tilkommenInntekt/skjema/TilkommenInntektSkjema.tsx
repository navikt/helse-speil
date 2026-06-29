import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonFragment } from '@io/graphql';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjemaTabell';
import { TilkommenInntektSkjemafelter } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjemafelter';
import {
    beregnInntektPerDag,
    tilPerioderPerOrganisasjonsnummer,
    utledSykefraværstilfelleperioder,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useTilkommenInntektFormDraft } from '@state/tilkommenInntektSkjema';
import { DatePeriod, DateString } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag, somNorskDato } from '@utils/date';
import { isNumber } from '@utils/typeguards';

interface TilkommenInntektProps {
    person: PersonFragment;
    andreTilkomneInntekter: ApiTilkommenInntekt[];
    startOrganisasjonsnummer: string;
    startFom: DateString;
    startTom: DateString;
    startPeriodebeløp: number;
    startEkskluderteUkedager: DateString[];
    draftStorageKey: string;
    submit: (values: TilkommenInntektSchema) => Promise<void>;
    isSubmitting: boolean;
    submitError?: string;
    cancel: () => void;
}

export const TilkommenInntektSkjema = ({
    person,
    andreTilkomneInntekter,
    startOrganisasjonsnummer,
    startFom,
    startTom,
    startPeriodebeløp,
    startEkskluderteUkedager,
    draftStorageKey,
    submit,
    isSubmitting,
    submitError,
    cancel,
}: TilkommenInntektProps): ReactElement => {
    const sykefraværstilfelleperioder = utledSykefraværstilfelleperioder(person);
    const eksisterendePerioder = tilPerioderPerOrganisasjonsnummer(andreTilkomneInntekter);

    const { draft, setDraft } = useTilkommenInntektFormDraft(draftStorageKey);

    const form = useForm({
        resolver: zodResolver(
            lagTilkommenInntektSchema(sykefraværstilfelleperioder, eksisterendePerioder, () => organisasjonEksisterer),
        ),
        reValidateMode: 'onBlur',
        defaultValues: {
            organisasjonsnummer: draft?.organisasjonsnummer ?? startOrganisasjonsnummer,
            fom: draft?.fom ?? somNorskDato(startFom) ?? '',
            tom: draft?.tom ?? somNorskDato(startTom) ?? '',
            periodebeløp: draft?.periodebeløp ?? startPeriodebeløp,
            notat: draft?.notat ?? '',
            ekskluderteUkedager: draft?.ekskluderteUkedager ?? startEkskluderteUkedager,
        },
    });

    const allValues = useWatch({ control: form.control });
    useEffect(() => {
        setDraft(allValues as Parameters<typeof setDraft>[0]);
    }, [allValues, setDraft]);

    const organisasjonsnummer = useWatch({ name: 'organisasjonsnummer', control: form.control });
    const { data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);
    // Bakenforliggende state som kun benyttes i valideringe
    const organisasjonEksisterer = organisasjonData?.navn != undefined;

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

    const gyldigPeriode: DatePeriod | undefined = useMemo(
        () =>
            erGyldigFom(fom) && erGyldigTom(tom)
                ? {
                      fom: norskDatoTilIsoDato(fom),
                      tom: norskDatoTilIsoDato(tom),
                  }
                : undefined,
        [fom, tom, erGyldigFom, erGyldigTom],
    );

    const { setValue } = form;

    const ekskluderteUkedager = useWatch({ name: 'ekskluderteUkedager', control: form.control });
    useEffect(() => {
        if (gyldigPeriode !== undefined) {
            if (ekskluderteUkedager.some((ekskludertUkedag) => !erIPeriode(ekskludertUkedag, gyldigPeriode))) {
                setValue(
                    'ekskluderteUkedager',
                    ekskluderteUkedager.filter((ekskludertUkedag) => erIPeriode(ekskludertUkedag, gyldigPeriode)),
                );
            }
        }
    }, [gyldigPeriode, ekskluderteUkedager, setValue]);

    const periodebeløp = useWatch({ name: 'periodebeløp', control: form.control });
    const inntektPerDag =
        gyldigPeriode !== undefined
            ? beregnInntektPerDag(isNumber(periodebeløp) ? periodebeløp : 0, gyldigPeriode, ekskluderteUkedager)
            : undefined;

    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <Box marginBlock="space-16" width="max-content">
                <HStack wrap={false}>
                    <VStack>
                        <Box background="neutral-soft" borderWidth="0 0 0 3" borderColor="accent" height="2.5rem">
                            <HStack style={{ paddingLeft: '5px' }} paddingBlock="space-8 space-16">
                                <Button
                                    icon={<XMarkIcon />}
                                    size="xsmall"
                                    variant="tertiary"
                                    type="button"
                                    onClick={cancel}
                                    disabled={isSubmitting}
                                >
                                    Avbryt
                                </Button>
                            </HStack>
                        </Box>
                        <TilkommenInntektSkjemafelter
                            form={form}
                            handleSubmit={submit}
                            submitError={submitError}
                            inntektPerDag={inntektPerDag}
                            erGyldigFom={erGyldigFom}
                            erGyldigTom={erGyldigTom}
                            sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                            isSubmitting={isSubmitting}
                            startPeriodebeløp={draft?.periodebeløp ?? startPeriodebeløp}
                            onCancel={cancel}
                        />
                    </VStack>
                    {gyldigPeriode !== undefined ? (
                        <VStack>
                            <Box
                                background="neutral-soft"
                                borderWidth="0 0 0 1"
                                borderColor="neutral-strong"
                                height="2.5rem"
                            ></Box>
                            <Controller
                                control={form.control}
                                name="ekskluderteUkedager"
                                render={({ field, fieldState }) => (
                                    <TilkommenInntektSkjemaTabell
                                        inntektsforhold={finnAlleInntektsforhold(person)}
                                        periode={gyldigPeriode}
                                        error={fieldState.error !== undefined}
                                        ekskluderteUkedager={field.value ?? []}
                                        setEkskluderteUkedager={(ekskluderteUkedager) => {
                                            field.onChange(ekskluderteUkedager);
                                            field.onBlur();
                                        }}
                                    />
                                )}
                            />
                        </VStack>
                    ) : (
                        <></>
                    )}
                </HStack>
            </Box>
        </ErrorBoundary>
    );
};

const TilkommenInntektError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise tilkommen inntekt for denne perioden.
    </Alert>
);
