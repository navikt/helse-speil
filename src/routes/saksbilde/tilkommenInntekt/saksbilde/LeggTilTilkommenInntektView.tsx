'use client';

import React, { ReactElement, useState } from 'react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { LeggTilTilkommenInntektDocument, Maybe } from '@io/graphql';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjema';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import {
    TilkommenInntektMedOrganisasjonsnummer,
    tilTilkomneInntekterMedOrganisasjonsnummer,
    useHentTilkommenInntektQuery,
} from '@state/tilkommenInntekt';
import { DateString } from '@typer/shared';
import { norskDatoTilIsoDato } from '@utils/date';

export const LeggTilTilkommenInntektView = (): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const { data: tilkommenInntektData, refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(
        person?.fodselsnummer,
    );
    const tilkomneInntekterMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer[] | undefined =
        tilkommenInntektData?.tilkomneInntektskilderV2 !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData.tilkomneInntektskilderV2)
            : undefined;
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [leggTilTilkommenInntekt] = useMutation(LeggTilTilkommenInntektDocument);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [ekskluderteUkedager, setEkskluderteUkedager] = useState<DateString[]>([]);

    if (!person || tilkomneInntekterMedOrganisasjonsnummer === undefined) {
        return null;
    }

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        await leggTilTilkommenInntekt({
            variables: {
                fodselsnummer: person.fodselsnummer,
                notatTilBeslutter: values.notat,
                tilkommenInntekt: {
                    periode: {
                        fom: norskDatoTilIsoDato(values.fom),
                        tom: norskDatoTilIsoDato(values.tom),
                    },
                    organisasjonsnummer: values.organisasjonsnummer,
                    periodebelop: values.periodebeløp.toString(),
                    ekskluderteUkedager: ekskluderteUkedager,
                },
            },
            onCompleted: (data) => {
                tilkommenInntektRefetch().then(() => {
                    navigerTilTilkommenInntekt(data.leggTilTilkommenInntekt.tilkommenInntektId);
                });
            },
        });
    };
    return (
        <TilkommenInntektSkjema
            person={person}
            andreTilkomneInntekter={tilkomneInntekterMedOrganisasjonsnummer}
            heading="Legg til tilkommen inntekt"
            startOrganisasjonsnummer=""
            startFom=""
            startTom=""
            startPeriodebeløp={0}
            ekskluderteUkedager={ekskluderteUkedager}
            setEkskluderteUkedager={setEkskluderteUkedager}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
        />
    );
};
