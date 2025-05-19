'use client';

import React, { ReactElement, useState } from 'react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { EndreTilkommenInntektDocument, Maybe, PersonFragment } from '@io/graphql';
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

const EndreTilkommenInntektSkjema = ({
    tilkommenInntekt,
    andreTilkomneInntekter,
    person,
}: {
    tilkommenInntekt: TilkommenInntektMedOrganisasjonsnummer;
    andreTilkomneInntekter: TilkommenInntektMedOrganisasjonsnummer[];
    person: PersonFragment;
}): ReactElement => {
    const [endreTilkommenInntekt] = useMutation(EndreTilkommenInntektDocument);
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [ekskluderteUkedager, setEkskluderteUkedager] = useState<DateString[]>(tilkommenInntekt.ekskluderteUkedager);
    const { refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(person.fodselsnummer);

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
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
                tilkommenInntektId: tilkommenInntekt.tilkommenInntektId,
            },
            onCompleted: () => {
                tilkommenInntektRefetch().then(() => {
                    navigerTilTilkommenInntekt(tilkommenInntekt.tilkommenInntektId);
                });
            },
        });
    };
    return (
        <TilkommenInntektSkjema
            person={person}
            andreTilkomneInntekter={andreTilkomneInntekter}
            heading="Endre tilkommen inntekt"
            startOrganisasjonsnummer={tilkommenInntekt.organisasjonsnummer}
            startFom={tilkommenInntekt.periode.fom}
            startTom={tilkommenInntekt.periode.tom}
            startPeriodebeløp={Number(tilkommenInntekt.periodebelop)}
            ekskluderteUkedager={ekskluderteUkedager}
            setEkskluderteUkedager={setEkskluderteUkedager}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
        />
    );
};

export const EndreTilkommenInntektView = ({
    tilkommenInntektId,
}: {
    tilkommenInntektId: string;
}): Maybe<ReactElement> => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person?.fodselsnummer);

    const tilkomneInntekterMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer[] | undefined =
        tilkommenInntektData?.tilkomneInntektskilderV2 !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData.tilkomneInntektskilderV2)
            : undefined;
    const tilkommenInntektMedOrganisasjonsnummer: TilkommenInntektMedOrganisasjonsnummer | undefined =
        tilkomneInntekterMedOrganisasjonsnummer?.find(
            (inntektMedOrganisasjonsnummer) => inntektMedOrganisasjonsnummer.tilkommenInntektId === tilkommenInntektId,
        );

    if (
        !person ||
        tilkomneInntekterMedOrganisasjonsnummer === undefined ||
        tilkommenInntektMedOrganisasjonsnummer === undefined
    ) {
        return null;
    }

    return (
        <EndreTilkommenInntektSkjema
            key={tilkommenInntektId}
            tilkommenInntekt={tilkommenInntektMedOrganisasjonsnummer}
            andreTilkomneInntekter={tilkomneInntekterMedOrganisasjonsnummer.filter(
                (inntekt) => inntekt !== tilkommenInntektMedOrganisasjonsnummer,
            )}
            person={person}
        />
    );
};
