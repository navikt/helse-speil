'use client';

import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';

import { TilkommenInntektSchema } from '@/form-schemas';
import { useMutation } from '@apollo/client';
import { GjenopprettTilkommenInntektDocument, Maybe, PersonFragment } from '@io/graphql';
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

const GjenopprettTilkommenInntektSkjema = ({
    tilkommenInntekt,
    andreTilkomneInntekter,
    person,
}: {
    tilkommenInntekt: TilkommenInntektMedOrganisasjonsnummer;
    andreTilkomneInntekter: TilkommenInntektMedOrganisasjonsnummer[];
    person: PersonFragment;
}): ReactElement => {
    const [gjenopprettTilkommenInntekt] = useMutation(GjenopprettTilkommenInntektDocument);
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [ekskluderteUkedager, setEkskluderteUkedager] = useState<DateString[]>(tilkommenInntekt.ekskluderteUkedager);
    const { refetch: tilkommenInntektRefetch } = useHentTilkommenInntektQuery(person.fodselsnummer);
    const router = useRouter();

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        await gjenopprettTilkommenInntekt({
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
        <Box marginBlock="4" width="max-content">
            <Box background={'surface-subtle'} borderWidth="0 0 0 3" borderColor="border-action">
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
            <TilkommenInntektSkjema
                person={person}
                andreTilkomneInntekter={andreTilkomneInntekter}
                startOrganisasjonsnummer={tilkommenInntekt.organisasjonsnummer}
                startFom={tilkommenInntekt.periode.fom}
                startTom={tilkommenInntekt.periode.tom}
                startPeriodebeløp={Number(tilkommenInntekt.periodebelop)}
                ekskluderteUkedager={ekskluderteUkedager}
                setEkskluderteUkedager={setEkskluderteUkedager}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
            />
        </Box>
    );
};

export const GjenopprettTilkommenInntektView = ({
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
        <GjenopprettTilkommenInntektSkjema
            key={tilkommenInntektId}
            tilkommenInntekt={tilkommenInntektMedOrganisasjonsnummer}
            andreTilkomneInntekter={tilkomneInntekterMedOrganisasjonsnummer.filter(
                (inntekt) => inntekt !== tilkommenInntektMedOrganisasjonsnummer,
            )}
            person={person}
        />
    );
};
