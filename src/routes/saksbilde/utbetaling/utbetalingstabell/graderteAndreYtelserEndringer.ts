import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserEndretDag,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';

export type GraderteAndreYtelserEndring = {
    tidspunkt: string;
    saksbehandlerIdent: string;
    dag: ApiGraderteAndreYtelserEndretDag;
};

export function endringerForDato(
    graderteAndreYtelser: ApiGraderteAndreYtelser | undefined,
    dato: string,
): GraderteAndreYtelserEndring[] {
    const gyldigDato = (dag: ApiGraderteAndreYtelserEndretDag) => dag.dato === dato;

    return (graderteAndreYtelser?.events ?? [])
        .filter((event) => event.dager.some(gyldigDato))
        .map((event) => ({
            tidspunkt: event.tidspunkt,
            saksbehandlerIdent: event.utfortAvSaksbehandlerIdent,
            dag: event.dager.find(gyldigDato)!,
        }));
}
