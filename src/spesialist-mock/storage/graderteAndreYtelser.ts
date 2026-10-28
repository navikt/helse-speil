import { v7 } from 'uuid';

import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
    ApiGraderteAndreYtelserEndretDag,
    ApiPostGraderteAndreYtelserErrorCode,
} from '@io/rest/generated/spesialist.schemas';

type Resultat =
    { type: 'OK'; versjon: string; endret: boolean } | { type: 'FEIL'; code: ApiPostGraderteAndreYtelserErrorCode };

export class GraderteAndreYtelserMock {
    private static strømmer: Map<string, ApiGraderteAndreYtelser[]> = new Map();

    static nullstill(): void {
        GraderteAndreYtelserMock.strømmer = new Map();
    }

    static hent(fødselsnummer: string): ApiGraderteAndreYtelser[] {
        return GraderteAndreYtelserMock.strømmer.get(fødselsnummer) ?? [];
    }

    static endre(fødselsnummer: string, request: ApiEndreGraderteAndreYtelserRequest): Resultat {
        const valideringsfeil = validerDager(request.dager);
        if (valideringsfeil) return { type: 'FEIL', code: valideringsfeil };

        const strømmer = GraderteAndreYtelserMock.hent(fødselsnummer);
        const eksisterende = strømmer.find(
            (strøm) =>
                strøm.yrkesaktivitet === request.yrkesaktivitet &&
                (strøm.organisasjonsnummer ?? null) === (request.organisasjonsnummer ?? null),
        );

        if ((request.versjon ?? null) !== (eksisterende?.versjon ?? null)) {
            return { type: 'FEIL', code: ApiPostGraderteAndreYtelserErrorCode.UTDATERT_TILSTAND };
        }

        const nåværendeDager = new Map(eksisterende?.dager.map((dag) => [dag.dato, dag]));
        const endredeDager = request.dager.filter((dag) => !erLike(dag, nåværendeDager.get(dag.dato)));
        if (eksisterende && endredeDager.length === 0) {
            return { type: 'OK', versjon: eksisterende.versjon, endret: false };
        }

        const versjon = v7();
        const event = {
            versjon,
            tidspunkt: new Date().toISOString(),
            utfortAvSaksbehandlerIdent: 'S123456',
            notatTilBeslutter: request.notatTilBeslutter,
            dager: endredeDager.map((dag) => endretFra(dag, nåværendeDager.get(dag.dato))),
        };
        endredeDager.forEach((dag) => nåværendeDager.set(dag.dato, dag));

        const oppdatert: ApiGraderteAndreYtelser = {
            yrkesaktivitet: request.yrkesaktivitet,
            organisasjonsnummer: request.organisasjonsnummer ?? null,
            versjon,
            dager: [...nåværendeDager.values()].sort((a, b) => a.dato.localeCompare(b.dato)),
            events: [...(eksisterende?.events ?? []), event],
        };
        GraderteAndreYtelserMock.strømmer.set(fødselsnummer, [
            ...strømmer.filter((strøm) => strøm !== eksisterende),
            oppdatert,
        ]);

        return { type: 'OK', versjon, endret: true };
    }
}

function validerDager(dager: ApiGraderteAndreYtelserDag[]): ApiPostGraderteAndreYtelserErrorCode | null {
    if (dager.length === 0) return ApiPostGraderteAndreYtelserErrorCode.MANGLER_ENDRINGER;
    if (dager.some((dag) => grader(dag).some((grad) => grad < 0))) {
        return ApiPostGraderteAndreYtelserErrorCode.NEGATIV_GRAD;
    }
    if (dager.some((dag) => grader(dag).reduce((sum, grad) => sum + grad, 0) > 100)) {
        return ApiPostGraderteAndreYtelserErrorCode.TOTAL_GRAD_OVER_100;
    }
    return null;
}

const grader = (dag: ApiGraderteAndreYtelserDag): number[] => [
    ...Object.values(dag.andreYtelserGrader),
    dag.sykdomsgrad,
    dag.arbeidsgrad,
];

function erLike(dag: ApiGraderteAndreYtelserDag, annen: ApiGraderteAndreYtelserDag | undefined): boolean {
    if (!annen) return false;
    const ytelser = Object.keys(dag.andreYtelserGrader);
    return (
        dag.sykdomsgrad === annen.sykdomsgrad &&
        dag.arbeidsgrad === annen.arbeidsgrad &&
        ytelser.length === Object.keys(annen.andreYtelserGrader).length &&
        ytelser.every((ytelse) => dag.andreYtelserGrader[ytelse] === annen.andreYtelserGrader[ytelse])
    );
}

const endretFra = (
    dag: ApiGraderteAndreYtelserDag,
    fra: ApiGraderteAndreYtelserDag | undefined,
): ApiGraderteAndreYtelserEndretDag => ({
    ...dag,
    fraAndreYtelserGrader: fra?.andreYtelserGrader ?? null,
    fraSykdomsgrad: fra?.sykdomsgrad ?? null,
    fraArbeidsgrad: fra?.arbeidsgrad ?? null,
});
