import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert, HStack } from '@navikt/ds-react';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { DateString } from '@/types/shared';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonFragment } from '@io/graphql';
import { TilkommenInntektSkjemaTabell } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemaTabell';
import { TilkommenInntektSkjemafelter } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjemafelter';
import {
    beregnInntektPerDag,
    tilPerioderPerOrganisasjonsnummer,
    utledSykefraværstilfelleperioder,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { TilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { erGyldigNorskDato, norskDatoTilIsoDato, somNorskDato } from '@utils/date';

interface TilkommenInntektProps {
    person: PersonFragment;
    andreTilkomneInntekter: TilkommenInntektMedOrganisasjonsnummer[];
    heading: string;
    startOrganisasjonsnummer: string;
    startFom: DateString;
    startTom: DateString;
    startPeriodebeløp: number;
    ekskluderteUkedager: DateString[];
    setEkskluderteUkedager: Dispatch<SetStateAction<DateString[]>>;
    isSubmitting: boolean;
    handleSubmit: (values: TilkommenInntektSchema) => Promise<void>;
}

export const TilkommenInntektSkjema = ({
    person,
    andreTilkomneInntekter,
    heading,
    startOrganisasjonsnummer,
    startFom,
    startTom,
    startPeriodebeløp,
    ekskluderteUkedager,
    setEkskluderteUkedager,
    isSubmitting,
    handleSubmit,
}: TilkommenInntektProps): ReactElement => {
    const [organisasjonsnavn, setOrganisasjonsnavn] = useState<string | undefined>(undefined);
    const organisasjonEksisterer = () => {
        return organisasjonsnavn !== undefined;
    };

    const sykefraværstilfelleperioder = utledSykefraværstilfelleperioder(person);
    const eksisterendePerioder = tilPerioderPerOrganisasjonsnummer(andreTilkomneInntekter);

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
    const fom = form.watch('fom');
    const tom = form.watch('tom');
    const periodebeløp = form.watch('periodebeløp');
    const erGyldigPeriode =
        erGyldigNorskDato(fom) && erGyldigNorskDato(tom) && norskDatoTilIsoDato(fom) <= norskDatoTilIsoDato(tom);
    const inntektPerDag = erGyldigPeriode
        ? beregnInntektPerDag(periodebeløp, norskDatoTilIsoDato(fom), norskDatoTilIsoDato(tom), ekskluderteUkedager)
        : undefined;

    const { data: orgData } = useOrganisasjonQuery(organisasjonsnummer);
    useEffect(() => {
        setOrganisasjonsnavn(orgData?.organisasjon?.navn ?? undefined);
    }, [orgData]);

    return (
        <ErrorBoundary fallback={<TilkommenInntektError />}>
            <HStack wrap={false}>
                <TilkommenInntektSkjemafelter
                    form={form}
                    heading={heading}
                    handleSubmit={handleSubmit}
                    inntektPerDag={inntektPerDag}
                    organisasjonsnavn={organisasjonsnavn}
                    sykefraværstilfelleperioder={sykefraværstilfelleperioder}
                    loading={isSubmitting}
                />
                {erGyldigPeriode && (
                    <TilkommenInntektSkjemaTabell
                        arbeidsgivere={person.arbeidsgivere}
                        periode={{ fom: norskDatoTilIsoDato(fom), tom: norskDatoTilIsoDato(tom) }}
                        ekskluderteUkedager={ekskluderteUkedager}
                        setEkskluderteUkedager={setEkskluderteUkedager}
                    />
                )}
            </HStack>
        </ErrorBoundary>
    );
};

const TilkommenInntektError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise tilkommen inntekt for denne perioden.
    </Alert>
);
