import React, { ReactElement, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Alert, Box, HStack, VStack } from '@navikt/ds-react';

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
    submit: (values: TilkommenInntektSchema) => Promise<void>;
    isSubmitting: boolean;
    submitError?: string;
}

export const TilkommenInntektSkjemaNy = ({
    person,
    andreTilkomneInntekter,
    startOrganisasjonsnummer,
    startFom,
    startTom,
    startPeriodebeløp,
    startEkskluderteUkedager,
    submit,
    isSubmitting,
    submitError,
}: TilkommenInntektProps): ReactElement => {
    const sykefraværstilfelleperioder = utledSykefraværstilfelleperioder(person);
    const eksisterendePerioder = tilPerioderPerOrganisasjonsnummer(andreTilkomneInntekter);

    const form = useForm({
        resolver: zodResolver(
            lagTilkommenInntektSchema(sykefraværstilfelleperioder, eksisterendePerioder, () => organisasjonEksisterer),
        ),
        reValidateMode: 'onBlur',
        defaultValues: {
            organisasjonsnummer: startOrganisasjonsnummer,
            fom: somNorskDato(startFom) ?? '',
            tom: somNorskDato(startTom) ?? '',
            periodebeløp: startPeriodebeløp,
            notat: '',
            ekskluderteUkedager: startEkskluderteUkedager,
        },
    });

    const organisasjonsnummer = useWatch({ name: 'organisasjonsnummer', control: form.control });
    const { data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);

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
            <Box width="max-content">
                <HStack wrap={false}>
                    <VStack>
                        <TilkommenInntektSkjemafelter
                            form={form}
                            handleSubmit={submit}
                            submitError={submitError}
                            inntektPerDag={inntektPerDag}
                            erGyldigFom={erGyldigFom}
                            erGyldigTom={erGyldigTom}
                            sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                            isSubmitting={isSubmitting}
                            startPeriodebeløp={startPeriodebeløp}
                        />
                    </VStack>
                    {gyldigPeriode !== undefined ? (
                        <VStack>
                            <Box style={{ marginBlock: '-160px' }}>
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
                            </Box>
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
