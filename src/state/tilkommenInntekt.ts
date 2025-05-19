import { QueryResult, useQuery } from '@apollo/client';
import {
    HentTilkommenInntektV2Document,
    HentTilkommenInntektV2Query,
    HentTilkommenInntektV2QueryVariables,
    TilkommenInntekt,
    TilkommenInntektEventListLocalDateEndring,
    TilkommenInntektskilde,
} from '@io/graphql';
import { DateString } from '@typer/shared';

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

export type DagMedEndringstype = {
    dag: DateString;
    endringstype: 'lagt til' | 'fjernet' | 'beholdt';
};

export const tilSorterteDagerMedEndringstype = (
    ekskluderteUkedager: TilkommenInntektEventListLocalDateEndring,
): DagMedEndringstype[] =>
    ekskluderteUkedager.fra
        .filter((dag) => !ekskluderteUkedager!.til.includes(dag))
        .map((dag): DagMedEndringstype => ({ dag: dag, endringstype: 'fjernet' }))
        .concat(
            ekskluderteUkedager.fra
                .filter((dag) => ekskluderteUkedager!.til.includes(dag))
                .map((dag): DagMedEndringstype => ({ dag: dag, endringstype: 'beholdt' })),
        )
        .concat(
            ekskluderteUkedager.til
                .filter((dag) => !ekskluderteUkedager!.fra.includes(dag))
                .map((dag): DagMedEndringstype => ({ dag: dag, endringstype: 'lagt til' })),
        )
        .sort((a, b) => a.dag.localeCompare(b.dag));
