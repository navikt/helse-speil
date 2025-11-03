import {
    ApiTilkommenInntekt,
    ApiTilkommenInntektEventEndringerListLocalDateEndring,
    ApiTilkommenInntektskilde,
} from '@io/rest/generated/spesialist.schemas';
import { useGetTilkomneInntektskilderForPerson } from '@io/rest/generated/tilkommen-inntekt/tilkommen-inntekt';
import { DateString } from '@typer/shared';

export const useHentTilkommenInntektQuery = (aktørId?: string) =>
    useGetTilkomneInntektskilderForPerson(aktørId!, {
        query: {
            enabled: !!aktørId,
        },
    });

export type TilkommenInntektMedOrganisasjonsnummer = ApiTilkommenInntekt & {
    organisasjonsnummer: string;
};

export const tilTilkomneInntekterMedOrganisasjonsnummer = (inntektskilder: ApiTilkommenInntektskilde[]) =>
    inntektskilder.flatMap((inntektskilde) =>
        inntektskilde.inntekter.map((tilkommenInntekt) => ({
            organisasjonsnummer: inntektskilde.organisasjonsnummer,
            ...tilkommenInntekt,
        })),
    );

export const useTilkommenInntektMedOrganisasjonsnummer = (tilkommenInntektId: string, aktørId?: string) => {
    const { data: tilkommenInntektResponse, refetch } = useHentTilkommenInntektQuery(aktørId);
    const tilkommenInntektMedOrganisasjonsnummer = tilkommenInntektResponse?.data
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
    ekskluderteUkedager: ApiTilkommenInntektEventEndringerListLocalDateEndring,
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
