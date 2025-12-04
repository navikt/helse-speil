import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
    // Bakomforliggende state som kun benyttes i valideringen
    const [organisasjonEksisterer, setOrganisasjonEksisterer] = useState<boolean>(false);

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

    const organisasjonsnummer = form.watch('organisasjonsnummer');
    const { data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);
    useEffect(() => {
        setOrganisasjonEksisterer(organisasjonData?.data?.navn != undefined);
    }, [organisasjonData]);

    const fom = form.watch('fom');
    const tom = form.watch('tom');

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

    const gyldigPeriode: DatePeriod | undefined =
        erGyldigFom(fom) && erGyldigTom(tom)
            ? {
                  fom: norskDatoTilIsoDato(fom),
                  tom: norskDatoTilIsoDato(tom),
              }
            : undefined;

    const { setValue } = form;

    const ekskluderteUkedager = form.watch('ekskluderteUkedager');
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

    const periodebeløp = form.watch('periodebeløp');
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
                                    background={'surface-subtle'}
                                    borderWidth="0 0 0 1"
                                    borderColor="border-strong"
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
                                            ekskluderteUkedager={field.value}
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
