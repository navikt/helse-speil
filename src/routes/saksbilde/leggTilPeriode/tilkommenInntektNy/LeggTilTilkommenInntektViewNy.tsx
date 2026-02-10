'use client';

import { useParams } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { usePostTilkomneInntekter } from '@io/rest/generated/tilkommen-inntekt/tilkommen-inntekt';
import { TilkommenInntektSkjemaNy } from '@saksbilde/leggTilPeriode/tilkommenInntektNy/TilkommenInntektSkjemaNy';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import { tilTilkomneInntekterMedOrganisasjonsnummer, useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { norskDatoTilIsoDato } from '@utils/date';

export const LeggTilTilkommenInntektViewNy = (): ReactElement | null => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const { data: tilkommenInntektData, refetch: tilkommenInntektRefetch } =
        useHentTilkommenInntektQuery(personPseudoId);
    const tilkomneInntekterMedOrganisasjonsnummer: ApiTilkommenInntekt[] | undefined =
        tilkommenInntektData !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData)
            : undefined;

    const { mutate: leggTilTilkommenInntekt } = usePostTilkomneInntekter();

    if (!person || tilkomneInntekterMedOrganisasjonsnummer === undefined) {
        return null;
    }

    const submit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        setSubmitError(undefined);
        leggTilTilkommenInntekt(
            {
                data: {
                    fodselsnummer: person.fodselsnummer,
                    notatTilBeslutter: values.notat,
                    verdier: {
                        periode: {
                            fom: norskDatoTilIsoDato(values.fom),
                            tom: norskDatoTilIsoDato(values.tom),
                        },
                        organisasjonsnummer: values.organisasjonsnummer,
                        periodebelop: values.periodebeløp.toString(),
                        ekskluderteUkedager: values.ekskluderteUkedager,
                    },
                },
            },
            {
                onSuccess: (data) => {
                    tilkommenInntektRefetch().then(() => {
                        navigerTilTilkommenInntekt(data.tilkommenInntektId);
                    });
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
        <TilkommenInntektSkjemaNy
            person={person}
            andreTilkomneInntekter={tilkomneInntekterMedOrganisasjonsnummer}
            startOrganisasjonsnummer=""
            startFom=""
            startTom=""
            startPeriodebeløp={0}
            startEkskluderteUkedager={[]}
            submit={submit}
            isSubmitting={isSubmitting}
            submitError={submitError}
        />
    );
};
