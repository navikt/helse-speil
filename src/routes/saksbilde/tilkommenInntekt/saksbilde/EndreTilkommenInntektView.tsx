'use client';

import React, { ReactElement, useState } from 'react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { EndreTilkommenInntektDocument, Maybe } from '@io/graphql';
import { EndreTilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/saksbilde/EndreTilkommenInntektSkjema';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import {
    TilkommenInntektMedOrganisasjonsnummer,
    tilTilkomneInntekterMedOrganisasjonsnummer,
    useHentTilkommenInntektQuery,
} from '@state/tilkommenInntekt';
import { DateString } from '@typer/shared';
import { norskDatoTilIsoDato } from '@utils/date';

export const EndreTilkommenInntektView = ({
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

    const [endreTilkommenInntekt] = useMutation(EndreTilkommenInntektDocument);

    const [ekskluderteUkedager, setEkskluderteUkedager] = useState<DateString[]>(
        tilkommenInntektMedOrganisasjonsnummer?.ekskluderteUkedager ?? [],
    );

    if (
        !person ||
        tilkomneInntekterMedOrganisasjonsnummer === undefined ||
        tilkommenInntektMedOrganisasjonsnummer === undefined
    ) {
        return null;
    }

    const submit = async (values: TilkommenInntektSchema) => {
        await endreTilkommenInntekt({
            variables: {
                endretTil: {
                    periode: {
                        fom: norskDatoTilIsoDato(values.fom),
                        tom: norskDatoTilIsoDato(values.tom),
                    },
                    organisasjonsnummer: values.organisasjonsnummer,
                    periodebelop: values.periodebeløp.toString(),
                    ekskluderteUkedager: ekskluderteUkedager,
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
        <EndreTilkommenInntektSkjema
            key={tilkommenInntektId}
            tilkommenInntekt={tilkommenInntektMedOrganisasjonsnummer}
            andreTilkomneInntekter={tilkomneInntekterMedOrganisasjonsnummer.filter(
                (inntekt) => inntekt !== tilkommenInntektMedOrganisasjonsnummer,
            )}
            person={person}
            ekskluderteUkedager={ekskluderteUkedager}
            setEkskluderteUkedager={setEkskluderteUkedager}
            submit={submit}
        />
    );
};
