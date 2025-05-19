import { QueryResult, useQuery } from '@apollo/client';
import {
    HentTilkommenInntektV2Document,
    HentTilkommenInntektV2Query,
    HentTilkommenInntektV2QueryVariables,
    TilkommenInntekt,
    TilkommenInntektskilde,
} from '@io/graphql';

export const useHentTilkommenInntektQuery = (
    fødselsnummer?: string,
): QueryResult<HentTilkommenInntektV2Query, HentTilkommenInntektV2QueryVariables> => {
    return useQuery(HentTilkommenInntektV2Document, {
        fetchPolicy: 'cache-first',
        variables: {
            fodselsnummer: fødselsnummer!,
        },
        skip: !fødselsnummer,
    });
};

export type TilkommenInntektMedOrganisasjonsnummer = TilkommenInntekt & {
    organisasjonsnummer: string;
};

export const tilTilkomneInntekterMedOrganisasjonsnummer = (inntektskilder: TilkommenInntektskilde[]) =>
    inntektskilder.flatMap((inntektskilde) =>
        inntektskilde.inntekter.map((tilkommenInntekt) => ({
            organisasjonsnummer: inntektskilde.organisasjonsnummer,
            ...tilkommenInntekt,
        })),
    );

export const useTilkommenInntektMedOrganisasjonsnummer = (tilkommenInntektId: string, fødselsnummer?: string) => {
    const { data: tilkommenInntektData, refetch } = useHentTilkommenInntektQuery(fødselsnummer);
    const tilkommenInntektMedOrganisasjonsnummer = tilkommenInntektData?.tilkomneInntektskilderV2
        ?.flatMap((tilkommenInntektskilde) =>
            tilkommenInntektskilde.inntekter.map((tilkommenInntekt) => ({
                organisasjonsnummer: tilkommenInntektskilde.organisasjonsnummer,
                tilkommenInntekt: tilkommenInntekt,
            })),
        )
        .find(
            (inntektMedOrganisasjonsnummer) =>
                inntektMedOrganisasjonsnummer.tilkommenInntekt.tilkommenInntektId === tilkommenInntektId,
        );

    const organisasjonsnummer = tilkommenInntektMedOrganisasjonsnummer?.organisasjonsnummer;
    const tilkommenInntekt = tilkommenInntektMedOrganisasjonsnummer?.tilkommenInntekt;

    return {
        organisasjonsnummer,
        tilkommenInntekt,
        tilkommenInntektRefetch: refetch,
    };
};
