'use client';

import React, { ReactElement } from 'react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { GjenopprettTilkommenInntektDocument, Maybe } from '@io/graphql';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/skjema/TilkommenInntektSkjema';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import {
    TilkommenInntektMedOrganisasjonsnummer,
    tilTilkomneInntekterMedOrganisasjonsnummer,
    useHentTilkommenInntektQuery,
} from '@state/tilkommenInntekt';
import { norskDatoTilIsoDato } from '@utils/date';

export const GjenopprettTilkommenInntektView = ({
    tilkommenInntektId,
}: {
    tilkommenInntektId: string;
}): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();

    const { data: tilkommenInntektData, refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(
        person?.fodselsnummer,
    );
    const tilkomneInntekterMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer[] | undefined =
        tilkommenInntektData?.tilkomneInntektskilderV2 !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData.tilkomneInntektskilderV2)
            : undefined;
    const tilkommenInntektMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer | undefined =
        tilkomneInntekterMedOrganisasjonsnummer?.find(
            (inntektMedOrganisasjonsnummer) => inntektMedOrganisasjonsnummer.tilkommenInntektId === tilkommenInntektId,
        );

    const [gjenopprettTilkommenInntekt] = useMutation(GjenopprettTilkommenInntektDocument);

    if (
        !person ||
        tilkomneInntekterMedOrganisasjonsnummer === undefined ||
        tilkommenInntektMedOrganisasjonsnummer === undefined
    ) {
        return null;
    }

    const submit = async (values: TilkommenInntektSchema) => {
        await gjenopprettTilkommenInntekt({
            variables: {
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
                tilkommenInntektId: tilkommenInntektMedOrganisasjonsnummer.tilkommenInntektId,
            },
            onCompleted: () => {
                tilkommenInntektRefetch().then(() => {
                    navigerTilTilkommenInntekt(tilkommenInntektMedOrganisasjonsnummer.tilkommenInntektId);
                });
            },
        });
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
        />
    );
};
