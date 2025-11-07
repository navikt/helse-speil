'use client';

import React, { ReactElement, useState } from 'react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { usePostTilkommenInntektEndre } from '@io/rest/generated/tilkommen-inntekt/tilkommen-inntekt';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjema';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import {
    TilkommenInntektMedOrganisasjonsnummer,
    tilTilkomneInntekterMedOrganisasjonsnummer,
    useHentTilkommenInntektQuery,
} from '@state/tilkommenInntekt';
import { norskDatoTilIsoDato } from '@utils/date';

export const EndreTilkommenInntektView = ({
    tilkommenInntektId,
}: {
    tilkommenInntektId: string;
}): ReactElement | null => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);

    const { data: tilkommenInntektResponse, refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(
        person?.personPseudoId,
    );
    const tilkommenInntektData = tilkommenInntektResponse?.data;
    const tilkomneInntekterMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer[] | undefined =
        tilkommenInntektData !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData)
            : undefined;
    const tilkommenInntektMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer | undefined =
        tilkomneInntekterMedOrganisasjonsnummer?.find(
            (inntektMedOrganisasjonsnummer) => inntektMedOrganisasjonsnummer.tilkommenInntektId === tilkommenInntektId,
        );

    const { mutate: endreTilkommenInntekt } = usePostTilkommenInntektEndre();

    if (
        !person ||
        tilkomneInntekterMedOrganisasjonsnummer === undefined ||
        tilkommenInntektMedOrganisasjonsnummer === undefined
    ) {
        return null;
    }

    const submit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        setSubmitError(undefined);
        endreTilkommenInntekt(
            {
                tilkommenInntektId: tilkommenInntektMedOrganisasjonsnummer.tilkommenInntektId,
                data: {
                    endretTil: {
                        periode: {
                            fom: norskDatoTilIsoDato(values.fom),
                            tom: norskDatoTilIsoDato(values.tom),
                        },
                        organisasjonsnummer: values.organisasjonsnummer,
                        periodebelop: values.periodebeløp.toString(),
                        ekskluderteUkedager: values.ekskluderteUkedager,
                    },
                    notatTilBeslutter: values.notat,
                },
            },
            {
                onSuccess: () => {
                    tilkommenInntektRefetch().then(() => {
                        navigerTilTilkommenInntekt(tilkommenInntektMedOrganisasjonsnummer.tilkommenInntektId);
                    });
                },
                onError: () => {
                    setSubmitError('Klarte ikke lagre endringer. Prøv igjen senere, eller kontakt en coach.');
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <TilkommenInntektSkjema
            person={person}
            andreTilkomneInntekter={tilkomneInntekterMedOrganisasjonsnummer.filter(
                (inntekt) => inntekt !== tilkommenInntektMedOrganisasjonsnummer,
            )}
            startOrganisasjonsnummer={tilkommenInntektMedOrganisasjonsnummer.organisasjonsnummer}
            startFom={tilkommenInntektMedOrganisasjonsnummer.periode.fom}
            startTom={tilkommenInntektMedOrganisasjonsnummer.periode.tom}
            startPeriodebeløp={Number(tilkommenInntektMedOrganisasjonsnummer.periodebelop)}
            startEkskluderteUkedager={tilkommenInntektMedOrganisasjonsnummer.ekskluderteUkedager}
            submit={submit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            cancel={() => navigerTilTilkommenInntekt(tilkommenInntektId)}
        />
    );
};
