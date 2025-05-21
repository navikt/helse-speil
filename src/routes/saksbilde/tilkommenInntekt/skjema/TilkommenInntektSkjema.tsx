import { useRouter } from 'next/navigation';
import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, HStack, VStack } from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonFragment } from '@io/graphql';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjemaTabell';
import { TilkommenInntektSkjemafelter } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjemafelter';
import {
    beregnInntektPerDag,
    tilPerioderPerOrganisasjonsnummer,
    utledSykefraværstilfelleperioder,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { TilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { DatePeriod, DateString } from '@typer/shared';
import { erGyldigNorskDato, erIPeriode, norskDatoTilIsoDato, plussEnDag, somNorskDato } from '@utils/date';

interface TilkommenInntektProps {
    person: PersonFragment;
    andreTilkomneInntekter: TilkommenInntektMedOrganisasjonsnummer[];
    startOrganisasjonsnummer: string;
    startFom: DateString;
    startTom: DateString;
    startPeriodebeløp: number;
    ekskluderteUkedager: DateString[];
    setEkskluderteUkedager: Dispatch<SetStateAction<DateString[]>>;
    submit: (values: TilkommenInntektSchema) => Promise<void>;
}

export const TilkommenInntektSkjema = ({
    person,
    andreTilkomneInntekter,
    startOrganisasjonsnummer,
    startFom,
    startTom,
    startPeriodebeløp,
    ekskluderteUkedager,
    setEkskluderteUkedager,
    submit,
}: TilkommenInntektProps): ReactElement => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        await submit(values);
    };

    const [organisasjonsnavn, setOrganisasjonsnavn] = useState<string | undefined>(undefined);
    const organisasjonEksisterer = () => {
        return organisasjonsnavn !== undefined;
    };

    const sykefraværstilfelleperioder = utledSykefraværstilfelleperioder(person);
    const eksisterendePerioder = tilPerioderPerOrganisasjonsnummer(andreTilkomneInntekter);

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(
            lagTilkommenInntektSchema(sykefraværstilfelleperioder, eksisterendePerioder, organisasjonEksisterer),
        ),
        reValidateMode: 'onBlur',
        defaultValues: {
            organisasjonsnummer: startOrganisasjonsnummer,
            fom: somNorskDato(startFom) ?? '',
            tom: somNorskDato(startTom) ?? '',
            periodebeløp: startPeriodebeløp,
            notat: '',
        },
    });
    const organisasjonsnummer = form.watch('organisasjonsnummer');
    const {
        loading: organisasjonLoading,
        data: organisasjonData,
        error: organisasjonError,
    } = useOrganisasjonQuery(organisasjonsnummer);
    useEffect(() => {
        setOrganisasjonsnavn(organisasjonData?.organisasjon?.navn ?? undefined);
    }, [organisasjonData]);

    const fom = form.watch('fom');
    const tom = form.watch('tom');

    const erGyldigFom = useCallback(
        (fom: string) => {
            if (!erGyldigNorskDato(fom)) return false;
            const isoDato = norskDatoTilIsoDato(fom);
            return (
                sykefraværstilfelleperioder.some((periode) =>
                    erIPeriode(isoDato, { fom: plussEnDag(periode.fom), tom: periode.tom }),
                ) &&
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

    useEffect(() => {
        if (gyldigPeriode !== undefined) {
            if (ekskluderteUkedager.some((ekskludertUkedag) => !erIPeriode(ekskludertUkedag, gyldigPeriode))) {
                setEkskluderteUkedager(
                    ekskluderteUkedager.filter((ekskludertUkedag) => erIPeriode(ekskludertUkedag, gyldigPeriode)),
                );
            }
        }
    }, [gyldigPeriode, ekskluderteUkedager, setEkskluderteUkedager]);

    const periodebeløp = form.watch('periodebeløp');
    const inntektPerDag =
        gyldigPeriode !== undefined
            ? beregnInntektPerDag(periodebeløp, gyldigPeriode.fom, gyldigPeriode.tom, ekskluderteUkedager)
            : undefined;

    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <Box marginBlock="4" width="max-content">
                <HStack wrap={false}>
                    <VStack>
                        <Box
                            background="surface-subtle"
                            borderWidth="0 0 0 3"
                            borderColor="border-action"
                            height="2.5rem"
                        >
                            <HStack style={{ paddingLeft: '5px' }} paddingBlock="2 4">
                                <Button
                                    icon={<XMarkIcon />}
                                    size="xsmall"
                                    variant="tertiary"
                                    type="button"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Avbryt
                                </Button>
                            </HStack>
                        </Box>
                        <TilkommenInntektSkjemafelter
                            form={form}
                            handleSubmit={handleSubmit}
                            inntektPerDag={inntektPerDag}
                            organisasjonLoading={organisasjonLoading}
                            organisasjonsnavn={organisasjonsnavn}
                            organisasjonHasError={organisasjonError !== undefined}
                            erGyldigFom={erGyldigFom}
                            erGyldigTom={erGyldigTom}
                            sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                            loading={isSubmitting}
                        />
                    </VStack>
                    {gyldigPeriode !== undefined ? (
                        <VStack>
                            <Box
                                background="surface-subtle"
                                borderWidth="0 0 0 1"
                                borderColor="border-strong"
                                height="2.5rem"
                            ></Box>
                            <TilkommenInntektSkjemaTabell
                                arbeidsgivere={person.arbeidsgivere}
                                periode={gyldigPeriode}
                                ekskluderteUkedager={ekskluderteUkedager}
                                setEkskluderteUkedager={setEkskluderteUkedager}
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
